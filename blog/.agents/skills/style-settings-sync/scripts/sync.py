import os
import re
import urllib.parse

def parse_markdown_tables(directory):
    styles = []
    # style-settings 디렉토리 내 모든 md 파일 파싱 (category-list.md 제외)
    for filename in os.listdir(directory):
        if not filename.endswith('.md') or filename == 'category-list.md':
            continue
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # 테이블 파싱 정규식
        # | 항목 | 설정값 | 설명 | 선택자 | 속성 |
        lines = content.split('\n')
        for line in lines:
            if line.strip().startswith('|') and not line.strip().startswith('| :---'):
                parts = [p.strip() for p in line.split('|')[1:-1]]
                if len(parts) >= 5 and parts[0] != '스타일 항목':
                    item, value, desc, selector, prop = parts[:5]
                    if selector and prop and value:
                        # 백틱(`, `) 제거
                        selector = selector.replace('`', '').strip()
                        prop = prop.replace('`', '').strip()
                        value = value.replace('`', '').strip()
                        styles.append((selector, prop, value))
    return styles

def update_css(css_path, styles):
    with open(css_path, 'r', encoding='utf-8') as f:
        css = f.read()

    for selector, prop, value in styles:
        # 미디어 쿼리가 포함된 경우 (@media screen ... -> #selector)
        media_match = re.match(r'(@media[^{]+)->\s*(.+)', selector)
        if media_match:
            media_query = media_match.group(1).strip()
            sub_selector = media_match.group(2).strip()
            
            # 미디어 쿼리 영역 찾기
            media_index = css.find(media_query)
            if media_index != -1:
                # 미디어 쿼리의 { 시작 위치 찾기
                brace_start = css.find('{', media_index)
                if brace_start != -1:
                    # 미디어 쿼리 블록 닫는 괄호 } 매칭 (중첩 대응)
                    depth = 1
                    brace_end = brace_start + 1
                    while depth > 0 and brace_end < len(css):
                        if css[brace_end] == '{':
                            depth += 1
                        elif css[brace_end] == '}':
                            depth -= 1
                        brace_end += 1
                    
                    media_block = css[brace_start:brace_end]
                    # 미디어 블록 내부에서 sub_selector 찾기
                    sub_selector_escaped = re.escape(sub_selector)
                    pattern = rf'({sub_selector_escaped}\s*\{{[^}}]*?{re.escape(prop)}\s*:\s*)([^;!}}]+)(\s*(!important)?\s*;?\s*}})'
                    
                    def repl(match):
                        imp = match.group(3)
                        # important 보존
                        if '!important' in imp:
                            return f"{match.group(1)}{value} !important;"
                        else:
                            return f"{match.group(1)}{value}{imp}"
                            
                    new_media_block, count = re.subn(pattern, repl, media_block, flags=re.DOTALL)
                    if count > 0:
                        css = css[:brace_start] + new_media_block + css[brace_end:]
                    else:
                        # 속성이 없는 경우 추가
                        add_pattern = rf'({sub_selector_escaped}\s*\{{)(.*?\r?\n?)(\}})'
                        # 첫번째 { 뒤에 속성 주입
                        new_media_block, count = re.subn(add_pattern, lambda m: f"{m.group(1)}\n  {prop}: {value};\n{m.group(2)}{m.group(3)}", media_block, 1, flags=re.DOTALL)
                        if count > 0:
                            css = css[:brace_start] + new_media_block + css[brace_end:]
            continue

        # 일반 선택자인 경우
        selector_escaped = re.escape(selector)
        # 속성이 이미 존재하는지 확인
        pattern = rf'({selector_escaped}\s*\{{[^}}]*?{re.escape(prop)}\s*:\s*)([^;!}}]+)(\s*(!important)?\s*;?\s*}})'
        
        def repl(match):
            imp = match.group(3)
            if '!important' in imp:
                return f"{match.group(1)}{value} !important;"
            else:
                return f"{match.group(1)}{value}{imp}"

        css, count = re.subn(pattern, repl, css, flags=re.DOTALL)
        
        if count == 0:
            # 선택자가 존재하는 경우 속성을 추가함
            selector_exist_pattern = rf'({selector_escaped}\s*\{{)(.*?\r?\n?)(\}})'
            css, add_count = re.subn(selector_exist_pattern, lambda m: f"{m.group(1)}\n  {prop}: {value};\n{m.group(2)}{m.group(3)}", css, 1, flags=re.DOTALL)
            
            if add_count == 0:
                # 선택자가 아예 없는 경우 맨 밑에 새로 추가
                css += f"\n\n{selector} {{\n  {prop}: {value};\n}}"

    # 연속된 개행 정리
    css = re.sub(r'\n{3,}', '\n\n', css)

    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css)

def parse_category_list(filepath):
    categories = []
    current_cat = None
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    in_section = False
    for line in lines:
        if '## 📂 카테고리 리스트' in line:
            in_section = True
            continue
        if in_section and line.strip() == '---':
            break
        if not in_section:
            continue
            
        line_str = line.rstrip('\r\n')
        if not line_str.strip():
            continue
            
        # 1. 서브 카테고리 매칭 (앞에 공백이 있고 - 로 시작)
        sub_match = re.match(r'^\s+-\s+(.+)$', line_str)
        if sub_match:
            if current_cat:
                sub_name = sub_match.group(1).strip()
                # 혹시 볼드 처리 등이 포함된 경우 정리
                sub_name = sub_name.replace('**', '').strip()
                current_cat["subs"].append(sub_name)
            continue
            
        # 2. 대분류 카테고리 매칭 (앞에 공백 없이 - 로 시작)
        cat_match = re.match(r'^-\s+\*\*([^*]+)\*\*(?:\s+\(이미지:\s*([^)]+)\))?', line_str)
        if not cat_match:
            cat_match = re.match(r'^-\s+([^(]+?)(?:\s+\(이미지:\s*([^)]+)\))?$', line_str)
            
        if cat_match:
            name = cat_match.group(1).strip()
            img = cat_match.group(2).strip() if cat_match.group(2) else f"thumb-{name.lower()}"
            img = img.replace(" ", "")
            current_cat = {"name": name, "image": img, "subs": []}
            categories.append(current_cat)
                
    return categories

def generate_category_html(categories):
    html_blocks = []
    for cat in categories:
        name = cat["name"]
        img = cat["image"]
        subs = cat["subs"]
        
        is_all_posts = (name == "전체 글")
        # 링크 빌드
        if is_all_posts:
            link = "[##_blog_link_##]category"
        else:
            link = f"[##_blog_link_##]category/{urllib.parse.quote(name)}"
            
        card_html = f'            <!-- {name} -->\n'
        card_html += '            <div class="category-card">\n'
        card_html += f'              <a class="card-link" href="{link}">\n'
        card_html += f'                <div class="category-thumb {img}"></div>\n'
        card_html += '                <div class="category-body">\n'
        
        # 줄바꿈 처리 대응
        display_name = name
        if "Principles" in name:
            display_name = "Engineering<br>Principles"
        elif "Core Tech" in name:
            display_name = "Core Tech<br>(기반 기술)"
            
        card_html += f'                  <strong>{display_name}</strong>\n'
        card_html += '                </div>\n'
        card_html += '              </a>\n'
        
        if not is_all_posts:
            card_html += '              <div class="card-footer-buttons">\n'
            card_html += '                <span class="index-label">Index</span>\n'
            card_html += '                <button type="button" class="btn-expand" onclick="toggleCategoryCard(this, event)">\n'
            card_html += '                  <i class="xi-angle-down"></i>\n'
            card_html += '                </button>\n'
            card_html += '              </div>\n'
            
        card_html += '              <ul class="sub-category-list">\n'
        for sub in subs:
            sub_link = f"[##_blog_link_##]category/{urllib.parse.quote(name)}/{urllib.parse.quote(sub)}"
            card_html += f'                <li><a href="{sub_link}">{sub}</a></li>\n'
        card_html += '              </ul>\n'
        card_html += '            </div>\n'
        
        html_blocks.append(card_html)
        
    return "\n".join(html_blocks)

def update_html_categories(html_path, categories_html):
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
        
    # <div class="category-grid"> ~ </div> 영역 찾기
    start_tag = '<div class="category-grid">'
    start_idx = html.find(start_tag)
    if start_idx == -1:
        print("Error: category-grid start tag not found")
        return
        
    # 닫는 </div> 찾기 (중첩 대응)
    depth = 1
    idx = start_idx + len(start_tag)
    while depth > 0 and idx < len(html):
        if html[idx:idx+4] == '<div':
            depth += 1
            idx += 4
        elif html[idx:idx+5] == '</div':
            depth -= 1
            if depth == 0:
                end_idx = idx
                break
            idx += 5
        else:
            idx += 1
            
    if depth == 0:
        new_html = html[:start_idx + len(start_tag)] + "\n" + categories_html + "\n            " + html[end_idx:]
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(new_html)
    else:
        print("Error: Matching closing div for category-grid not found")

def main():
    # 작업 디렉토리는 스크립트 실행 위치 기준으로 상위 blog 폴더 설정
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
    settings_dir = os.path.join(base_dir, "style-settings")
    css_path = os.path.join(base_dir, "style.css")
    html_path = os.path.join(base_dir, "tistory.html")
    
    # 1. 스타일 변경 사항 반영
    print("Parsing style settings...")
    styles = parse_markdown_tables(settings_dir)
    print(f"Found {len(styles)} style properties to sync.")
    update_css(css_path, styles)
    print("style.css synchronized successfully.")
    
    # 2. 카테고리 리스트 변경 사항 반영
    category_list_path = os.path.join(settings_dir, "category-list.md")
    if os.path.exists(category_list_path):
        print("Parsing category list...")
        categories = parse_category_list(category_list_path)
        print(f"Found {len(categories)} categories.")
        categories_html = generate_category_html(categories)
        update_html_categories(html_path, categories_html)
        print("tistory.html categories synchronized successfully.")
        
if __name__ == '__main__':
    main()

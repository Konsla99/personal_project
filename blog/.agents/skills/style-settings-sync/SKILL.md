---
name: style-settings-sync
description: style-settings/ 디렉토리 내 마크다운 설정 파일의 변경사항(diff)을 감지하여 style.css 및 tistory.html에 자동으로 동기화하여 반영합니다.
---

# Style Settings Sync Specialist

이 스킬은 사용자가 HTML/CSS를 몰라도 마크다운 설정 파일(`style-settings/*.md`)을 수정하는 것만으로 스타일과 카테고리 구조 변경을 실제 블로그 코드에 완벽하게 반영해 주는 역할을 합니다.

## 작동 원칙

1. **자동화 스크립트 활용:** 
   - 복잡한 정규식 매칭 및 태그 구조 치환을 직접 수행하지 않고, 내장된 자동화 파이썬 스크립트인 [sync.py](file:///D:/git_hub_repository/personal_project/blog/.agents/skills/style-settings-sync/scripts/sync.py)를 실행하여 정확히 수정합니다.
   
2. **동기화 실행 방법:**
   - 기본적으로 스크립트는 `git status`를 확인하여 `style-settings/` 폴더 내에서 **실제 변경된 설정 파일만 똑똑하게 선택적으로 동기화**합니다 (예: 카테고리 파일만 고쳤다면 CSS 스타일 갱신은 실행을 건너뜁니다).
   - 아래의 명령어를 통해 실행하며, 명시적인 강제 옵션을 줄 수도 있습니다:
     ```powershell
     # 변경 감지된 항목만 스마트하게 동기화 (기본)
     python .agents/skills/style-settings-sync/scripts/sync.py

     # 모든 설정 파일 무조건 강제 동기화
     python .agents/skills/style-settings-sync/scripts/sync.py --all

     # 스타일 설정(CSS)만 무조건 강제 동기화
     python .agents/skills/style-settings-sync/scripts/sync.py --css

     # 카테고리 목록(HTML)만 무조건 강제 동기화
     python .agents/skills/style-settings-sync/scripts/sync.py --html
     ```
   
3. **변경 결과 검증:**
   - 스크립트 실행이 성공하면 `git diff` 명령어 등을 통해 `style.css`와 `tistory.html`이 변경된 부분을 확인합니다.
   - HTML의 닫히지 않은 태그, CSS의 세미콜론 누락 등 구문 에러가 없는지 무결성을 검증합니다.

## 동기화 대상 설정 파일
*   **스타일 설정 파일 (CSS 연동):** `sidebar.md`, `home.md`, `category-card.md`, `category-grid.md`, `box-article-list.md`, `article-type-common.md`, `article-type-resize.md`, `checked-item.md`
*   **목록 설정 파일 (HTML 연동):** `category-list.md` (카테고리 리스트)

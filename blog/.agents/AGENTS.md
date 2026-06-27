# 프로젝트 규칙 (Project Rules)

이 파일은 **Konsla99/personal_project/blog** 프로젝트에서 작업하는 모든 AI 에이전트(Antigravity 및 서브에이전트)가 준수해야 하는 행동 지침과 프로젝트 규칙을 정의합니다.

---

## 1. 기본 원칙 (Core Rules)

*   **소통 언어:** 모든 에이전트 응답과 로그, 피드백은 반드시 **한국어(Korean)**로 작성되어야 합니다.
*   **상호 의존성 고려:** [tistory.html](file:///D:/git_hub_repository/personal_project/blog/tistory.html)과 [style.css](file:///D:/git_hub_repository/personal_project/blog/style.css)는 밀접하게 연동되어 있습니다. 두 파일 중 하나만 수정할 경우 디자인이나 기능이 오작동할 수 있으므로, 수정 시 두 파일 간의 연관 관계를 항상 분석하고 필요시 동시 수정을 반영해야 합니다.

---

## 2. 서브에이전트 및 스킬 활용 규칙

HTML 및 CSS 관련 수정 작업은 임의로 수행하지 않고, 프로젝트 전용 스킬을 탑재한 서브에이전트를 활용하여 단계별로 진행합니다.

1.  **분석 단계 (`tech-blog-analyzer` 스킬 활용):**
    *   수정할 대상의 HTML 구조와 CSS 선택자를 정밀 탐색합니다.
    *   공통 클래스 및 레이아웃의 영향을 조사하고 부작용(Side-effect)을 사전에 검증합니다.
    *   대상 파일, 변경 대상 코드 블록(`old_string`), 수정 가이드 및 주의사항이 포함된 **분석 리포트**를 먼저 작성합니다.
2.  **실행 및 검증 단계 (`tech-blog-executor` 스킬 활용):**
    *   분석 리포트를 바탕으로 대상 코드를 정확하게 수정합니다.
    *   색상 값이나 마진 등은 일관성을 위해 가능하면 `:root`에 선언된 CSS 변수를 활용합니다.
    *   코드 수정 후 문법 오류(닫히지 않은 태그, 중복 정의 등)가 없는지 점검하고 반응형 및 다크 테마 무결성을 검증합니다.

---

## 3. 디자인 시스템 및 기술 요구사항

*   **디자인 테마:** 다크한 분위기 및 테크 느낌(Dark Tech Mode)을 지향합니다.
*   **색상 및 타이포그래피:** 어두운 블루 계열의 메인 컬러 및 대비와 가독성이 뛰어난 폰트를 사용합니다. 색상 조작 시 CSS `:root` 변수를 최대한 활용하여 일관성을 유지합니다.
*   **핵심 렌더링 유지:** 블로그 포스트 본문의 **콜아웃(Callout) 구조 렌더링**은 깨지지 않고 완벽히 유지되어야 합니다.
*   **리소스 경로:**
    *   이미지 및 정적 리소스는 [image src/](file:///D:/git_hub_repository/personal_project/blog/image%20src) 디렉토리를 참조하거나 저장합니다.
    *   도구 및 스킬 관련 정의는 [skills/](file:///D:/git_hub_repository/personal_project/blog/skills) 폴더를 참조합니다.

---

## 4. 사용자 친화적 스타일 수정 환경 (Markdown 설정 동기화)

사용자가 HTML/CSS 코드를 직접 수정하지 않고도 스타일 및 목록(카테고리)을 쉽게 편집할 수 있도록, `style-settings/` 폴더 내에 마크다운 설정 파일을 제공합니다.

### 4.1. 스타일 및 목록 설정 파일 목록 및 매핑 정보
*   **[사이드바 설정 (sidebar.md)](file:///D:/git_hub_repository/personal_project/blog/style-settings/sidebar.md):** `#wrap.layout-tech .area-aside`, `.area-aside .link-sidebar`, `.area-aside .title-sidebar` 등
*   **[홈 화면 설정 (home.md)](file:///D:/git_hub_repository/personal_project/blog/style-settings/home.md):** `#wrap.layout-tech .area-main`, `#wrap.layout-tech .main`, `#wrap.layout-tech .main-header` 등
*   **[카테고리 카드 설정 (category-card.md)](file:///D:/git_hub_repository/personal_project/blog/style-settings/category-card.md):** `#wrap.layout-tech .category-card`, `.category-thumb`, `.category-body` 등
*   **[카테고리 그리드 설정 (category-grid.md)](file:///D:/git_hub_repository/personal_project/blog/style-settings/category-grid.md):** `#wrap.layout-tech .category-grid` 및 미디어 쿼리 내 컬럼 개수
*   **[글 목록 박스 설정 (box-article-list.md)](file:///D:/git_hub_repository/personal_project/blog/style-settings/box-article-list.md):** `#wrap.layout-tech .article-list-wrapper .box-article-list` 및 미디어 쿼리 내 컬럼 개수
*   **[일반 글 카드 설정 (article-type-common.md)](file:///D:/git_hub_repository/personal_project/blog/style-settings/article-type-common.md):** `.article-type-common`과 그 내부 썸네일, 제목, 요약 텍스트 속성
*   **[리사이즈 글 카드 설정 (article-type-resize.md)](file:///D:/git_hub_repository/personal_project/blog/style-settings/article-type-resize.md):** `.article-type-resize` 및 그 내부 썸네일 비율, 글자 수 제한 등
*   **[선택된 아이템 설정 (checked-item.md)](file:///D:/git_hub_repository/personal_project/blog/style-settings/checked-item.md):** `.checked-item` 클래스의 배경색, 테두리 및 강조 포인트 바 스타일
*   **[카테고리 목록 설정 (category-list.md)](file:///D:/git_hub_repository/personal_project/blog/style-settings/category-list.md):** 블로그 메인 화면의 대분류 카테고리 카드와 서브 카테고리 목록(구조적 추가/삭제/변경)

### 4.2. 에이전트 행동 지침 (Sync Protocol)
1.  **설정값 변경 감지:** 사용자가 `style-settings/` 디렉토리 하위의 특정 마크다운 파일에 위치한 테이블이나 리스트의 값을 수정하고 반영을 요청할 경우, 에이전트는 해당 설정값을 읽어옵니다.
2.  **CSS 동기화 작업 (스타일 수정 시):**
    *   마크다운에 기재된 `대상 CSS 선택자` 및 스타일 항목에 매칭되는 실제 스타일 코드를 `style.css`에서 탐색합니다.
    *   `tech-blog-analyzer` 스킬을 사용하여 실제 변경 위치와 영향을 정밀 조사한 후 분석 리포트를 작성합니다.
    *   `tech-blog-executor` 스킬을 사용하여 `style.css`에서 해당 선택자의 속성값을 사용자가 변경한 설정값으로 업데이트합니다.
    *   만약 `checked-item.md`와 같이 `style.css`에 기존 정의가 없는 경우, `style.css` 맨 하단에 새로운 스타일 클래스를 추가합니다.
3.  **HTML 카테고리 구조 동기화 작업 (카테고리 리스트 수정 시):**
    *   사용자가 `category-list.md`를 편집한 뒤 반영을 요청하면, 마크다운의 계층적 리스트 구조(Level 1: 대분류, Level 2: 서브 카테고리)를 파싱합니다.
    *   `tistory.html` 내의 `<div class="category-grid">` 태그 블록을 찾아 내부의 `<div class="category-card">` 컴포넌트 목록을 파싱한 카테고리 데이터 기반으로 동적 재생성합니다.
    *   각 카테고리 카드는 링크(`[##_blog_link_##]category/이름`), 썸네일(`class="category-thumb thumb-[이름]"`), 텍스트 바디(`<strong>이름</strong>`), 서브 카테고리 리스트(`class="sub-category-list"`) 구조를 가집니다.
    *   서브 카테고리가 존재하는 카드에만 펼치기 버튼(`.btn-expand`)을 렌더링하고 `sub-category-list` 하위에 `<li>` 링크 구조를 정확히 빌드합니다. (단, "전체 글"은 예외적으로 서브 카테고리 및 펼치기 버튼이 생략됩니다.)
4.  **반영 검증:** 수정 사항이 빌드 및 렌더링에 오류를 발생시키지 않는지, 문법적 결함이 없는지 확인하고, 변경 완료된 최종 스타일 및 레이아웃 상태를 확인하여 사용자에게 완료 보고를 제공합니다.



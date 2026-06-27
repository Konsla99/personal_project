# 카테고리 및 서브 카테고리 목록 설정 (Category List Settings)

블로그 메인 화면의 카테고리 그리드(`.category-grid`) 영역의 대분류 카테고리 카드와 서브 카테고리 목록을 관리하는 설정 파일입니다.
HTML 코드를 직접 고칠 필요 없이 아래의 **카테고리 리스트** 항목들을 자유롭게 수정(추가/삭제/순서 변경/이름 변경)해 주세요.

## ✍️ 카테고리 목록 작성 규칙
1. **대분류 카테고리 (Level 1):** `- **[카테고리명]**` 또는 `- [카테고리명]` 형식으로 작성합니다.
   * 예: `- **AI**`
   * 뒤에 사용할 이미지 클래스를 명시할 수 있습니다: `(이미지: thumb-ai)` (생략 시 카테고리명을 영문 소문자로 바꾼 기본 클래스가 적용됩니다.)
2. **서브 카테고리 (Level 2):** 대분류 바로 아래에 공백 2개(들여쓰기)를 넣고 `- [서브카테고리명]` 형식으로 작성합니다.
   * 예: 
     ```markdown
     - **AI** (이미지: thumb-ai)
       - 프롬프트 엔지니어링
       - AI 서비스
       - Agent
     ```
3. **전체 글:** "전체 글" 카테고리는 서브 카테고리를 가지지 않는 메인 홈 링크로 고정됩니다.

---

## 📂 카테고리 리스트

- **전체 글** (이미지: thumb-new)
- **AI** (이미지: thumb-ai)
  - 프롬프트 엔지니어링
  - AI 서비스
  - Agent
- **Engineering Principles** (이미지: thumb-principles)
  - 설계방식
  - Convention
  - SW TEST
- **Computer Vision** (이미지: thumb-cv)
  - 캘리브레이션
- **Core Tech (기반 기술)** (이미지: thumb-dev)
  - CMake
  - 언어
  - Communication(통신)
  - 알고리즘&자료구조
  - 시스템 프로그래밍
- **TOOLS** (이미지: thumb-tools)
  - 마크다운 <옵시디언>
  - Git & GitHub
  - Project Management
- **SemiConductor** (이미지: thumb-semi)
  - SEMI standard
  - 이론
- **PLAYGROUND** (이미지: thumb-playground)
  - 블로그 관리하기

---
**반영 요청 안내:**
- 목록 수정 및 저장 완료 후, 에이전트에게 "카테고리 리스트 파일 수정본 반영해줘" 라고 한국어로 요청해 주세요. 에이전트가 이를 읽어 `tistory.html` 내의 카테고리 마크업을 자동으로 업데이트합니다.

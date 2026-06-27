# 홈 화면 메인 스타일 설정 (Home Main Style Settings)

홈 화면의 메인 콘텐츠 영역 및 헤더 스타일을 설정하는 파일입니다. 아래 테이블의 **현재 설정값** 부분을 수정해 주세요.

| 스타일 항목 | 현재 설정값 | 설명 | 대상 CSS 선택자 |
| :--- | :--- | :--- | :--- |
| 메인 영역 최대 너비 | `1800px` | 홈 화면 메인 본문 콘텐츠의 가로 최대 크기 | `#wrap.layout-tech .area-main` |
| 메인 영역 여백 | `60px 20px` | 메인 콘텐츠 상하/좌우 여백 (padding) | `#wrap.layout-tech .main` |
| 헤더 하단 마진 | `50px` | 메인 헤더와 콘텐츠 사이의 마진 | `#wrap.layout-tech .main-header` |
| 헤더 타이틀 크기 | `2.2rem` | 블로그 메인 제목 폰트 크기 | `#wrap.layout-tech .main-header h1` |
| 헤더 타이틀 색상 | `var(--point-color)` | 블로그 메인 제목 색상 | `#wrap.layout-tech .main-header h1` |
| 헤더 서브텍스트 색상 | `var(--text-muted)` | 블로그 대문 설명 문구 색상 | `#wrap.layout-tech .main-header p` |
| 헤더 서브텍스트 크기 | `0.95rem` | 블로그 대문 설명 문구 폰트 크기 | `#wrap.layout-tech .main-header p` |

---
**주의사항:** 
- `var(--point-color)`나 `var(--text-muted)`는 글로벌 CSS 변수입니다. 필요시 직접적인 색상값(예: `#ffffff`)으로 변경할 수도 있습니다.
- 수정 완료 후 에이전트에게 "홈 스타일 변경 사항을 반영해줘" 라고 요청하세요.

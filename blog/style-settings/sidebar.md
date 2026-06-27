# 사이드바 스타일 설정 (Sidebar Style Settings)

사이드바 영역(`.area-aside`)의 스타일을 정의하는 설정 파일입니다. 아래 테이블의 **현재 설정값** 부분을 수정해 주세요.

| 스타일 항목 | 현재 설정값 | 설명 | 대상 CSS 선택자 | 실제 CSS 속성 |
| :--- | :--- | :--- | :--- | :--- |
| 배경색 | `#2d333b` | 사이드바의 배경 색상 | `#wrap.layout-tech .area-aside` | `background-color` |
| 테두리선 | `1px solid #444c56` | 사이드바 우측 테두리 스타일 | `#wrap.layout-tech .area-aside` | `border-right` |
| 너비 (width) | `var(--aside-width)` | 사이드바의 가로 크기 | `#wrap.layout-tech .area-aside` | `width` |
| 폰트 크기 | `2.3rem` | 사이드바 내부 텍스트 기본 크기 | `#wrap.layout-tech .area-aside` | `font-size` |
| 링크 텍스트 색상 | `#f0f6fc` | 사이드바 카테고리 링크 색상 | `.area-aside .link-sidebar` | `color` |
| 링크 텍스트 크기 | `13px` | 사이드바 카테고리 링크 폰트 크기 | `.area-aside .link-sidebar` | `font-size` |
| 타이틀 텍스트 색상 | `#f0f6fc` | 사이드바 내 각 모듈의 타이틀 색상 | `.area-aside .title-sidebar` | `color` |
| 타이틀 텍스트 크기 | `14px` | 사이드바 내 각 모듈의 타이틀 폰트 크기 | `.area-aside .title-sidebar` | `font-size` |

---
**주의사항:** 
- 변경값을 적용할 때는 올바른 CSS 값 형식(예: `#ffffff`, `200px`, `1.2rem` 등)을 지켜주세요.
- 수정 완료 후 에이전트에게 "사이드바 스타일 변경 사항을 반영해줘" 라고 요청하면 실제 `style.css`에 즉시 적용됩니다.

# 선택된 아이템 스타일 설정 (Checked Item Settings)

선택 또는 강조 표시된 글 아이템(`.checked-item`)의 스타일을 정의하는 설정 파일입니다. 아래 테이블의 **현재 설정값** 부분을 수정해 주세요.
(현재 CSS에 선언되지 않은 신규 스타일로, 사용자가 이 설정값을 변경하면 `.checked-item` 클래스 스타일이 `style.css` 하단에 새로 추가되거나 수정됩니다.)

| 스타일 항목 | 현재 설정값 | 설명 | 대상 CSS 선택자 | 실제 CSS 속성 |
| :--- | :--- | :--- | :--- | :--- |
| 배경색 | `rgba(255, 255, 255, 0.05)` | 선택된 아이템의 배경색 | `.checked-item` | `background-color` |
| 테두리 색상 | `var(--point-color)` | 선택된 아이템의 테두리선 색상 (예: `#58a6ff`) | `.checked-item` | `border-color` |
| 테두리 스타일 | `1px solid var(--point-color)` | 테두리 선 굵기 및 종류 | `.checked-item` | `border` |
| 좌측 포인트 바 두께 | `4px` | 좌측에 강조용 세로 바 두께 (0이면 숨김) | `.checked-item::before` | `width` |
| 좌측 포인트 바 색상 | `var(--point-color)` | 강조용 세로 바 색상 | `.checked-item::before` | `background-color` |
| 불투명도 (Opacity) | `1.0` | 카드 기본 불투명도 | `.checked-item` | `opacity` |

---
**주의사항:**
- 이 클래스는 현재 `tistory.html` 혹은 특정 리스트의 아이템에 적용되었을 때 강조 효과를 주는 데 사용됩니다.
- 수정 완료 후 에이전트에게 "선택된 아이템(checked-item) 스타일 변경 사항을 반영해줘" 라고 요청하세요.

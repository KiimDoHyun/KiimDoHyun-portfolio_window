import { cva } from "@styled-system/css";
import { styled } from "@styled-system/jsx";

const timeBarRecipe = cva({
  base: {
    display: "grid",
    gridTemplateRows: "130px 1fr 250px",

    position: "absolute",
    right: 0,
    width: "timebar.width",
    height: "timebar.height",
    boxShadow: "panelUp",

    transition: "medium",

    backgroundColor: "shell.bg",

    "& .timeArea, & .calendarArea, & .functionArea": {
      padding: "20",
      boxSizing: "border-box",
    },

    "& .timeArea": {
      color: "shell.text",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "center",
    },

    "& .time": {
      flex: 2,
      fontSize: "3rem",
      cursor: "default",
    },

    "& .date": {
      flex: 1,
      fontSize: "1rem",
      // 원래 옅은 청색(#90b8da). 가까운 raw 가 없어 surface.textMuted 로 dim 시키고
      // hover 시 shell.text 로 밝아지는 방향으로 tone shift 를 유지한다.
      color: "surface.textMuted",
      cursor: "pointer",
    },

    "& .date:hover": {
      color: "shell.text",
    },

    "& .time, & .date": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "lighter",
    },

    "& .calendarArea": {
      borderTop: "1px solid token(colors.shell.border)",
      borderBottom: "1px solid token(colors.shell.border)",
      display: "grid",
      gridTemplateRows: "20px 1fr",
      gap: "8",
    },

    "& .calendarHeader": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },

    "& .year_month": {
      color: "surface.textSubtle",
      cursor: "default",
    },

    "& .year_month:hover": {
      color: "shell.text",
    },

    "& .calendarArrowArea": {
      width: "87px",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },

    "& .calendarArrowArea > div": {
      width: "40px",
      height: "100%",
    },

    "& .calendarBody": {
      transition: "fast",
      scale: 1,
      opacity: 1,
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gridTemplateRows: "repeat(7, 1fr)",
      // 각 .box가 내부에 2px transparent border를 예약하므로 gap 0으로도 셀 구분 유지
      gap: "0",
    },

    "& .active_calendarBody": {
      scale: 0.97,
      opacity: 0.1,
    },

    "& .box": {
      border: "2px solid transparent",
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "default",
    },

    "& .box_prev, & .box_next": {
      // 이전/다음 달 셀은 현재 달(shell.text) 보다 한 단계 어둡게 (#a9a9a9 계열)
      // — 기존 CSS named `gray` (#808080) 의 "다른 달 = 더 어둡다" 관습을 유지
      color: "surface.textMuted",
    },

    "& .box_title, & .box_cur, & .box_curMonth": {
      color: "shell.text",
    },

    "& .box_curDate": {
      color: "shell.text",
      position: "relative",
      backgroundColor: "accent.solid",
    },

    "& .box_curDate:after": {
      content: '""',
      width: "100%",
      height: "100%",
      border: "2px solid token(colors.windowChrome.border)",
      position: "absolute",
      boxSizing: "border-box",
    },

    "& .box_content:hover": {
      borderColor: "shell.border",
    },
  },
  variants: {
    active: {
      true: {
        bottom: "token(sizes.taskbar)",
        opacity: 1,
        pointerEvents: "auto",
        zIndex: 999,
      },
      false: {
        bottom: "-150px",
        opacity: 0,
        pointerEvents: "none",
        zIndex: 0,
      },
    },
  },
});

export const TimeBarBlock = styled("div", timeBarRecipe);

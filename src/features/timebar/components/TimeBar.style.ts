import { cva } from "@styled-system/css";
import { styled } from "@styled-system/jsx";

const timeBarRecipe = cva({
  base: {
    display: "grid",
    gridTemplateRows: "130px 1fr 250px",

    position: "absolute",
    right: 0,
    width: "360px",
    height: "720px",
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
      // 원래 옅은 청색. 가까운 raw 없어 shell.text로 흡수 — 수동 검증 포인트
      color: "shell.text",
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
      color: "gray.500",
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
      color: "shell.text",
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
        bottom: "50px",
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

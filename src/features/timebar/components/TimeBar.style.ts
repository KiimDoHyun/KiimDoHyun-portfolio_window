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
    boxShadow: "0px -3px 20px 3px #00000061",

    transition: "0.25s",

    backgroundColor: "#393a3b",

    "& .timeArea, & .calendarArea, & .functionArea": {
      padding: "20px",
      boxSizing: "border-box",
    },

    "& .timeArea": {
      color: "white",
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
      color: "#90b8da",
      cursor: "pointer",
    },

    "& .date:hover": {
      color: "#aaaaaa",
    },

    "& .time, & .date": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "lighter",
    },

    "& .calendarArea": {
      borderTop: "1px solid #707070",
      borderBottom: "1px solid #707070",
      display: "grid",
      gridTemplateRows: "20px 1fr",
      gap: "10px",
    },

    "& .calendarHeader": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },

    "& .year_month": {
      color: "#c7c7c7",
      cursor: "default",
    },

    "& .year_month:hover": {
      color: "#ededed",
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
      transition: "0.2s",
      scale: 1,
      opacity: 1,
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gridTemplateRows: "repeat(7, 1fr)",
      gap: "2px",
    },

    "& .active_calendarBody": {
      scale: 0.97,
      opacity: 0.1,
    },

    "& .box": {
      border: "2px solid #ffffff00",
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "default",
    },

    "& .box_prev, & .box_next": {
      color: "gray",
    },

    "& .box_title, & .box_cur, & .box_curMonth": {
      color: "#ededed",
    },

    "& .box_curDate": {
      color: "#ededed",
      position: "relative",
      backgroundColor: "#0078d7",
    },

    "& .box_curDate:after": {
      content: '""',
      width: "100%",
      height: "100%",
      border: "2px solid black",
      position: "absolute",
      boxSizing: "border-box",
    },

    "& .box_content:hover": {
      borderColor: "#797979",
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

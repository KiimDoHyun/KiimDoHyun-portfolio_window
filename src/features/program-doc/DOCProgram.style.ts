import { css } from "@styled-system/css";

export const docProgramContentStyle = css({
  "&.contentsArea_Cover": {
    display: "grid",
    gridTemplateRows: "auto 1fr",
    overflow: "hidden",
  },

  "& .doc_header": {
    display: "flex",
    flexDirection: "column",
    gap: "4",
    paddingY: "8",
    paddingX: "16",
    borderBottom: "1px solid",
    borderColor: "surface.border",
  },

  "& .doc_meta": {
    display: "grid",
    gridTemplateColumns: "auto auto",
    columnGap: "32",
    rowGap: "2",
    alignItems: "center",
    justifyContent: "start",
  },

  "& .doc_metaLabel": {
    fontSize: "13px",
    fontWeight: "medium",
    color: "surface.textMuted",
  },

  "& .doc_metaValue": {
    fontSize: "14px",
    fontWeight: "bold",
    color: "surface.textPrimary",
  },

  "& .doc_body": {
    overflow: "auto",
    paddingTop: "0",
    paddingBottom: "16",
    paddingX: "16",
    fontSize: "14px",
    lineHeight: "1.5",
    color: "surface.textPrimary",
    textAlign: "left",
  },

  "& .doc_body h1": {
    fontSize: "22px",
    fontWeight: "bold",
    position: "sticky",
    top: "0",
    backgroundColor: "windowChrome.bg",
    paddingTop: "6",
    paddingBottom: "6",
    marginX: "-16px",
    marginBottom: "16",
    paddingX: "16",
    zIndex: 1,
  },

  "& .doc_empty": {
    color: "surface.textMuted",
    fontStyle: "italic",
  },

  "& .doc_body h2": {
    fontSize: "18px",
    fontWeight: "bold",
    marginTop: "16",
    marginBottom: "8",
  },

  "& .doc_body h3": {
    fontSize: "15px",
    fontWeight: "bold",
    marginBottom: "6",
    marginTop: "16",
  },

  "& .doc_body p": {
    marginBottom: "6",
  },

  "& .doc_body ul, & .doc_body ol": {
    paddingLeft: "20",
    marginBottom: "10",
  },

  "& .doc_body li": {
    marginBottom: "4",
  },

  "& .doc_body code": {
    backgroundColor: "surface.content",
    paddingY: "1",
    paddingX: "4",
    borderRadius: "3px",
    fontSize: "13px",
  },

  "& .doc_body pre": {
    backgroundColor: "surface.content",
    padding: "12",
    borderRadius: "6px",
    overflow: "auto",
    marginBottom: "10",
  },

  "& .doc_body pre code": {
    padding: "0",
    backgroundColor: "transparent",
  },

  "& .doc_body strong": {
    fontWeight: "bold",
  },

  "& .doc_body em": {
    fontStyle: "italic",
  },

  "& .doc_body table": {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "10",
    fontSize: "13px",
  },

  "& .doc_body th, & .doc_body td": {
    border: "1px solid",
    borderColor: "surface.border",
    padding: "8",
    textAlign: "left",
  },

  "& .doc_body th": {
    fontWeight: "bold",
    backgroundColor: "surface.content",
  },

  "& .doc_body blockquote": {
    borderLeft: "3px solid",
    borderColor: "surface.border",
    paddingLeft: "12",
    marginBottom: "10",
    color: "surface.textMuted",
    fontStyle: "italic",
  },

  "& .doc_body hr": {
    border: "none",
    borderTop: "1px solid",
    borderColor: "surface.border",
    marginTop: "16",
    marginBottom: "16",
  },
});

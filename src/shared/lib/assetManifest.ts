import monitor from "@images/icons/monitor.png";
import folderEmpty from "@images/icons/folder_empty.png";
import folderFull from "@images/icons/folder_full.png";
import imageDefault from "@images/icons/image_default.png";
import documentDefault from "@images/icons/document_default.png";
import chrome from "@images/icons/chrome.png";
import react from "@images/icons/react.svg";
import javascript from "@images/icons/javascript.svg";
import typescript from "@images/icons/typescript.svg";
import redux from "@images/icons/redux.svg";
import recoil from "@images/icons/recoil.svg";
import reactQuery from "@images/icons/reactquery.svg";
import html from "@images/icons/html5.svg";
import css from "@images/icons/css.svg";
import styledcomponent from "@images/icons/styledcomponents.svg";
import github from "@images/icons/github.svg";
import vue from "@images/icons/vuedotjs.svg";
import vuetify from "@images/icons/vuetify.svg";
import claudeCode from "@images/icons/claude.svg";
import vite from "@images/icons/vite.svg";
import vitest from "@images/icons/vitest.svg";
import pandacss from "@images/icons/pandacss.svg";
import zustand from "@images/icons/zustand-plain.svg";
import kdhProfile from "@images/김도현.jpg";
import githubLine from "@images/icons/github_line.png";
import blogLine from "@images/icons/blog_line.png";
import companyLine from "@images/icons/company_line.png";
import linkedinLine from "@images/icons/linkedin_line.png";
import campusLineBlue from "@images/icons/campus_line_blue.png";
import bookLineBlue from "@images/icons/book_line_blue.png";
import codingLineBlue from "@images/icons/coding_line_blue.png";
import businessLineBlue from "@images/icons/business_line_blue.png";
import gearLineBlue from "@images/icons/gear_line_blue.png";
import webLineBlue from "@images/icons/web_line_blue.png";
import companyLineBlue from "@images/icons/company_line_blue.png";

const assetManifest: Record<string, string> = {
    monitor,
    folder_empty: folderEmpty,
    folder_full: folderFull,
    image_default: imageDefault,
    document_default: documentDefault,
    chrome,
    react,
    javascript,
    typescript,
    redux,
    recoil,
    react_query: reactQuery,
    html,
    css,
    styledcomponent,
    github,
    vue,
    vuetify,
    claude_code: claudeCode,
    vite,
    vitest,
    pandacss,
    zustand,
    kdh_profile: kdhProfile,
    github_line: githubLine,
    blog_line: blogLine,
    company_line: companyLine,
    linkedin_line: linkedinLine,
    campus_line_blue: campusLineBlue,
    book_line_blue: bookLineBlue,
    coding_line_blue: codingLineBlue,
    business_line_blue: businessLineBlue,
    gear_line_blue: gearLineBlue,
    web_line_blue: webLineBlue,
    company_line_blue: companyLineBlue,
};

export const resolveAsset = (key: string): string | undefined =>
    assetManifest[key];

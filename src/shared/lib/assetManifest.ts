import monitor from "@images/icons/monitor.png";
import folderEmpty from "@images/icons/folder_empty.png";
import folderFull from "@images/icons/folder_full.png";
import imageDefault from "@images/icons/image_default.png";
import documentDefault from "@images/icons/document_default.png";
import chrome from "@images/icons/chrome.png";
import react from "@images/icons/react.png";
import javascript from "@images/icons/javascript.png";
import redux from "@images/icons/redux.png";
import recoil from "@images/icons/recoil.png";
import nodejs from "@images/icons/nodejs.png";
import html from "@images/icons/html.png";
import css from "@images/icons/css.png";
import styledcomponent from "@images/icons/styledcomponent.png";
import github from "@images/icons/github.png";
import vue from "@images/icons/vue.png";
import python from "@images/icons/python.png";
import bootstrap from "@images/icons/bootstrap.png";
import tailwindCss from "@images/icons/tailwind-css.png";
import vuetify from "@images/icons/vuetify.png";
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
    redux,
    recoil,
    nodejs,
    html,
    css,
    styledcomponent,
    github,
    vue,
    python,
    bootstrap,
    tailwind_css: tailwindCss,
    vuetify,
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

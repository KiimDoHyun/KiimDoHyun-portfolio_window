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
};

export const resolveAsset = (key: string): string | undefined =>
    assetManifest[key];

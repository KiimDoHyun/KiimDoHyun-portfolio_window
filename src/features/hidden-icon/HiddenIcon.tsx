import React from "react";
import react from "@images/icons/react.png";
import javascript from "@images/icons/javascript.png";
import recoil from "@images/icons/recoil.png";
import html from "@images/icons/html.png";
import css from "@images/icons/css.png";
import styledcomponent from "@images/icons/styledcomponent.png";
import SkillIcon from "./components/SkillIcon";
import { HiddenIconBlock } from "./HiddenIcon.style";

const HiddenIcon = ({ active }: { active: boolean }) => {
  const skillList = [
    {
      src: react,
      text: "react",
    },
    {
      src: javascript,
      text: "javascript",
    },
    {
      src: recoil,
      text: "recoil",
    },
    {
      src: html,
      text: "html",
    },
    {
      src: css,
      text: "css",
    },
    {
      src: styledcomponent,
      text: "styled-components",
    },
  ];
  return (
    <HiddenIconBlock active={active}>
      {skillList.map((item) => (
        <SkillIcon key={item.text} {...item} />
      ))}
    </HiddenIconBlock>
  );
};

export default HiddenIcon;

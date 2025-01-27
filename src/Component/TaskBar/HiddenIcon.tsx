import React from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { rc_taskbar_hiddenIcon_active } from "../../store/taskbar";
import react from "../../asset/images/icons/react.png";
import javascript from "../../asset/images/icons/javascript.png";
import recoil from "../../asset/images/icons/recoil.png";
import html from "../../asset/images/icons/html.png";
import css from "../../asset/images/icons/css.png";
import styledcomponent from "../../asset/images/icons/styledcomponent.png";
import SkillIcon from "./SkillIcon";

const HiddenIcon = () => {
  const active = useRecoilValue(rc_taskbar_hiddenIcon_active);
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

const HiddenIconBlock = styled.div<{ active: boolean }>`
  position: absolute;
  right: 125px;
  bottom: ${(props) => (props.active ? "50" : "-500")}px;
  z-index: ${(props) => (props.active ? "99999" : "0")};
  width: 120px;
  // height: 100px;

  background-color: #393a3be0;

  border: 1px solid #4d4d4d;
  display: flex;
  flex-wrap: wrap;

  padding: 2px;
  .skillIcon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.1s;
  }

  .skillIcon:hover {
    background-color: #515151;
  }

  .skillIcon img {
    width: 60%;
    height: 60%;
  }
`;
export default HiddenIcon;

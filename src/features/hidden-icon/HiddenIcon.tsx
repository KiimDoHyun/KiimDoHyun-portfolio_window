import React from "react";
import react from "@images/icons/react.svg";
import typescript from "@images/icons/typescript.svg";
import vite from "@images/icons/vite.svg";
import zustand from "@images/icons/zustand-plain.svg";
import pandacss from "@images/icons/pandacss.svg";
import vitest from "@images/icons/vitest.svg";
import SkillIcon from "./components/SkillIcon";
import { HiddenIconBlock } from "./HiddenIcon.style";

const HiddenIcon = ({ active }: { active: boolean }) => {
  const skillList = [
    {
      src: react,
      text: "react",
    },
    {
      src: typescript,
      text: "typescript",
    },
    {
      src: vite,
      text: "vite",
    },
    {
      src: zustand,
      text: "zustand",
    },
    {
      src: pandacss,
      text: "panda-css",
    },
    {
      src: vitest,
      text: "vitest",
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

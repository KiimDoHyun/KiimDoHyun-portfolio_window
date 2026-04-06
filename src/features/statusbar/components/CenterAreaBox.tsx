import React from "react";
import { useRecoilValue } from "recoil";
import { css } from "@styled-system/css";
import defaultImg from "@images/icons/project_default_1.png";
import { rc_global_Directory_List } from "@store/global";

const centerAreaBoxBlockStyle = css({
  width: "100%",
  height: "50px",

  display: "flex",
  alignItems: "center",
  gap: "10px",

  padding: "5px",
  boxSizing: "border-box",

  "& img": {
    width: "25px",
    height: "25px",
  },
  "& .text": {
    fontSize: "14px",
    fontWeight: "lighter",
    color: "#e8e8e8",
    cursor: "default",
  },
});

const CenterAreaBox = ({
  item,
  img,
  name,
  showImg = true,
  onClick,
}: {
  item?: any;
  img: string;
  name: string;
  showImg?: boolean;
  onClick?: (directory: {
    name: string;
    type: string;
    icon: any;
    parent: string;
  }) => void;
}) => {
  const directory = useRecoilValue(rc_global_Directory_List);
  return (
    <div
      className={`statusBox ${centerAreaBoxBlockStyle}`}
      onClick={() => {
        if (item) {
          onClick?.(
            directory.find((findItem) => findItem.name === item.parent)
          );
        }
      }}
    >
      {showImg && <img src={img ? img : defaultImg} alt="name" />}
      <div className="text">{name}</div>
    </div>
  );
};

export default React.memo(CenterAreaBox);

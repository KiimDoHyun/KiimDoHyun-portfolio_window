import React from "react";

import imgMenu from "@images/icons/hamburger_menu.png";
import LeftAreaBox from "./LeftAreaBox";
import CenterAreaBox from "./CenterAreaBox";
import RightAreaBox from "./RightAreaBox";
import { StatusBarBlock } from "./StatusBar.style";

const StatusBar = ({
  active,
  activeLeftArea_Detail,
  statusBar_LeftArea_Items,

  projectDatas,
  techStack_main,
  techStack_sub,

  onMouseEnter,
  onMouseLeave,
  onClickBox,
}) => {
  return (
    <StatusBarBlock active={active}>
      {/* 소개 */}
      <div
        className="statusBarBoxArea leftArea"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* 마우스 호버에 따른 너비 변경을 위해 한단계 추가 */}
        <div
          className={
            activeLeftArea_Detail
              ? "leftArea_Contents leftArea_Contents_Wide"
              : "leftArea_Contents"
          }
        >
          <div className="leftArea_top">
            <LeftAreaBox img={imgMenu} name={"소개"} onClick={onClickBox} />
          </div>
          <div className="leftArea_contents">
            {statusBar_LeftArea_Items.map((item, idx) => (
              <LeftAreaBox
                key={idx}
                img={item.img}
                name={item.text}
                onClick={onClickBox}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 프로젝트 */}
      <div
        className={
          active
            ? "statusBarBoxArea centerArea show_animation"
            : "statusBarBoxArea centerArea"
        }
      >
        {projectDatas.map((item, idx) => {
          let showTitle = false;
          if (idx === 0) showTitle = true;
          else {
            if (item.parent !== projectDatas[idx - 1].parent) {
              showTitle = true;
            }
          }
          return (
            <React.Fragment key={idx}>
              {showTitle && (
                <CenterAreaBox showImg={false} img={null} name={item.parent} />
              )}
              <CenterAreaBox
                item={item}
                img={item.icon}
                name={item.name}
                onClick={onClickBox}
              />
            </React.Fragment>
          );
        })}
      </div>

      {/* 기술 스택 */}
      <div
        className={
          active
            ? "statusBarBoxArea rightArea show_animation"
            : "statusBarBoxArea rightArea"
        }
      >
        <div className="rightArea_title">
          <p>주로 사용하는 기술 스택</p>
        </div>
        <div className="rightArea_boxArea">
          {techStack_main.map((item, idx) => (
            <RightAreaBox
              key={idx}
              img={item.icon}
              name={item.name}
              item={item}
              onClick={onClickBox}
            />
          ))}
        </div>

        <div className="rightArea_title">
          <p>사용해본적은 있는 기술</p>
        </div>
        <div className="rightArea_boxArea">
          {techStack_sub.map((item, idx) => (
            <RightAreaBox
              key={idx}
              img={item.icon}
              name={item.name}
              item={item}
              onClick={onClickBox}
            />
          ))}
        </div>
      </div>
    </StatusBarBlock>
  );
};

export default React.memo(StatusBar);

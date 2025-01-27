import React from "react";
import styled, { keyframes } from "styled-components";

import imgMenu from "../../asset/images/icons/hamburger_menu.png";
import LeftAreaBox from "./StatusBar/LeftAreaBox";
// import { projectDatas, techStack, techStack_sub } from "../../Common/data";
import CenterAreaBox from "./StatusBar/CenterAreaBox";
import RightAreaBox from "./StatusBar/RightAreaBox";

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
const show_from_bottom = keyframes`
from {
    scale: 1 1.5;
    translate: 0 200px;
}
to {
    translate: 0 0px;
    scale: 1 1.0;
}
`;

const StatusBarBlock = styled.div<{ active: boolean }>`
  p {
    margin: 0;
  }

  position: absolute;
  left: 0;
  bottom: ${(props) => (props.active ? "50px" : "-150px")};
  opacity: ${(props) => (props.active ? "1" : "0")};
  pointer-events: ${(props) => (props.active ? "auto" : "none")};
  z-index: ${(props) => (props.active ? "999" : "0")};
  width: 650px;
  height: 500px;
  box-shadow: 0px -3px 20px 3px #00000061;

  transition: 0.4s;
  transition-timing-function: cubic-bezier(0, 0.5, 0, 1);
  background-color: #393a3b;

  display: flex;
  gap: 10px;

  padding-top: 5px;
  box-sizing: border-box;

  .statusBarBoxArea {
    height: 100%;
  }

  .statusBox {
    box-sizing: border-box;
  }

  .statusBox:hover {
    background-color: #ffffff24;
  }

  .leftArea {
    position: relative;
    width: 50px;
  }

  .leftArea_Contents {
    position: absolute;
    background-color: #393a3b;
    width: 100%;
    height: 100%;

    transition: 0.1s;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .leftArea_Contents_Wide {
    width: 220px;
    z-index: 10;

    box-shadow: 0px 9px 20px 0px #181818;
  }

  .centerArea {
    background-color: transparent;
    width: 270px;

    overflow-y: scroll;
  }

  .rightArea {
    width: 330px;

    overflow-y: scroll;

    // display: flex;
    // flex-direction: column;
  }

  .rightArea_title {
    // flex-basis: 5%;
    height: 10px;

    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #e8e8e8;
    cursor: pointer;
    margin: 10px 0;
    padding-left: 5px;
  }

  .rightArea_boxArea {
    // flex-basis: 95%;

    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 5px;

    padding: 5px;
    margin-bottom: 30px;
  }

  .show_animation {
    animation-duration: 0.4s;
    animation-timing-function: cubic-bezier(0, 0.65, 0.35, 1);
    animation-name: ${show_from_bottom};
  }

  // 스크롤바

  .rightArea::-webkit-scrollbar,
  .centerArea::-webkit-scrollbar {
    width: 2px;
  }
  .rightArea::-webkit-scrollbar-thumb,
  .centerArea::-webkit-scrollbar-thumb {
    background-color: #acacac;
  }
`;
export default React.memo(StatusBar);

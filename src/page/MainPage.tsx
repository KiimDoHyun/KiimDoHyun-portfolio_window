import React from "react";
import styled from "styled-components";
import wallpaper from "@images/wallpaper/Samsung_wallpaper.jpg";
import { useSetRecoilState } from "recoil";
import TimeBarContainer from "@Container/TaskBar/TimeBarContainer";
import {
  rc_taskbar_hiddenIcon_active,
  rc_taskbar_infoBar_active,
  rc_taskbar_statusBar_active,
  rc_taskbar_timeBar_active,
} from "@store/taskbar";
import DisplayCover from "@Component/DisplayCover";
import HiddenIcon from "@Component/TaskBar/HiddenIcon";
import TaskBarContainer from "@Container/TaskBar/TaskBarContainer";
import InfoBarContainer from "@Container/TaskBar/InfoBarContainer";
import WindowContainer from "@Container/WindowContainer";
import StatusBarContainer from "@Container/TaskBar/StatusBarContainer";

const MainPage = () => {
  const setActive_status = useSetRecoilState(rc_taskbar_statusBar_active);
  const setActive_time = useSetRecoilState(rc_taskbar_timeBar_active);
  const setActiveInfoBar = useSetRecoilState(rc_taskbar_infoBar_active);
  const setHiddenIcon = useSetRecoilState(rc_taskbar_hiddenIcon_active);
  return (
    <MainPageBlock>
      <DisplayCover />
      <div
        className="windowCover"
        onMouseDown={() => {
          setActive_status(false);
          setActive_time(false);
          setActiveInfoBar(false);
          setHiddenIcon(false);
        }}
      >
        <WindowContainer />
      </div>
      <div className="taskBarCover">
        <TaskBarContainer />
      </div>

      {/* 시작 */}
      <StatusBarContainer />

      {/* 시간 */}
      <TimeBarContainer />

      {/* 정보 */}
      <InfoBarContainer />

      {/* 숨겨진 아이콘 */}
      <HiddenIcon />

      {/* 미리보기 */}
      {/* <Preview /> */}
    </MainPageBlock>
  );
};

const MainPageBlock = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  display: grid;
  grid-template-rows: 1fr 50px;
  background-image: url(${wallpaper});
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;

  .windowCover {
    position: relative;
    padding: 10px;
  }

  .taskBarCover {
    position: relative;
    background-color: #20343b;
    z-index: 10000;
  }
`;
export default MainPage;

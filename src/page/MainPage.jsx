import React from "react";
import styled from "styled-components";
import TaskBarContainer from "../Container/Main/TaskBarContainer";
import WindowContainer from "../Container/Main/WindowContainer";
import wallpaper from "../asset/images/wallpaper/Samsung_wallpaper.jpg";
import StatusBar from "../Component/TaskBar/StatusBar";
import { useSetRecoilState } from "recoil";
import TimeBarContainer from "../Container/Main/TaskBar/TimeBarContainer";
import {
    rc_taskbar_infoBar_active,
    rc_taskbar_statusBar_active,
    rc_taskbar_timeBar_active,
} from "../store/taskbar";
import InfoBarContainer from "../Container/Main/InfoBarContainer";
import DisplayCover from "../Component/DisplayCover";

const MainPage = () => {
    const setActive_status = useSetRecoilState(rc_taskbar_statusBar_active);
    const setActive_time = useSetRecoilState(rc_taskbar_timeBar_active);
    const setActiveInfoBar = useSetRecoilState(rc_taskbar_infoBar_active);
    return (
        <MainPageBlock>
            <DisplayCover />
            <div
                className="windowCover"
                onMouseDown={() => {
                    setActive_status(false);
                    setActive_time(false);
                    setActiveInfoBar(false);
                }}
            >
                <WindowContainer />
            </div>
            <div className="taskBarCover">
                <TaskBarContainer />
            </div>

            {/* 시작 */}
            <StatusBar />

            {/* 시간 */}
            <TimeBarContainer />

            {/* 정보 */}
            <InfoBarContainer />
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
    }
`;
export default MainPage;

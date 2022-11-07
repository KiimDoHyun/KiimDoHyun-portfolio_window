import React from "react";
import styled from "styled-components";
import TaskBarContainer from "../Container/Main/TaskBarContainer";
import WindowContainer from "../Container/Main/WindowContainer";
import wallpaper from "../asset/images/wallpaper/Samsung_wallpaper.jpg";
import StatusBar from "../Component/TaskBar/StatusBar";
import { useSetRecoilState } from "recoil";
import { rc_statusBar_active } from "../store/statusBar";

const MainPage = () => {
    const setActive = useSetRecoilState(rc_statusBar_active);
    return (
        <MainPageBlock>
            <div className="windowCover" onMouseDown={() => setActive(false)}>
                <WindowContainer />
            </div>
            <div className="taskBarCover">
                <TaskBarContainer />
            </div>

            {/* z-index 가장 높게, 바깥 클릭시 사라짐 구현 필요, 비활성화 상태 처리 필요 */}
            <StatusBar />
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

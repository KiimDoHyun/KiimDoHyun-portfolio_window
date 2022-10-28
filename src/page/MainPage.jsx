import React from "react";
import styled from "styled-components";
import TaskBarContainer from "../Container/Main/TaskBarContainer";
import WindowContainer from "../Container/Main/WindowContainer";
import wallpaper from "../asset/images/wallpaper/Samsung_wallpaper.jpg";
import StatusBar from "../Component/TaskBar/StatusBar";

const MainPage = () => {
    return (
        <MainPageBlock>
            <div className="windowCover">
                <WindowContainer />
                <StatusBar />
            </div>
            <div className="taskBarCover">
                <TaskBarContainer />
            </div>
        </MainPageBlock>
    );
};

const MainPageBlock = styled.div`
    width: 100vw;
    height: 100vh;
    position: relative;
    display: grid;
    grid-template-rows: 9fr 0.5fr;
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

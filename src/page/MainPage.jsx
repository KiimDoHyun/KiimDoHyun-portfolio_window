import React from "react";
import styled from "styled-components";
import TaskBarContainer from "../Container/Main/TaskBarContainer";
import WindowContainer from "../Container/Main/WindowContainer";
import wallpaper from "../asset/images/wallpaper/Samsung_wallpaper.jpg";

const MainPage = () => {
    return (
        <MainPageBlock>
            <div className="windowCover">
                <WindowContainer />
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

    .windowCover {
        position: relative;
        padding: 10px;
    }

    .taskBarCover {
        position: relative;
        background-color: #211e3bdb;
    }
`;
export default MainPage;

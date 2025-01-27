import styled from "styled-components";
import wallpaper from "../asset/images/wallpaper/Samsung_wallpaper.jpg";
import WindowContainer from "@Container/WindowContainer";
import TaskBarContainer from "@Container/TaskBar/TaskBarContainer";

const Main = (props) => {
  const { iconBoxArr } = props;
  return (
    <MainBlock>
      <div className="windowCover">
        <WindowContainer iconBoxArr={iconBoxArr} />
      </div>
      <div className="taskBarCover">
        <TaskBarContainer />
      </div>
    </MainBlock>
  );
};

const MainBlock = styled.div`
  // width: 100vw;
  // height: 100vh;
  // position: relative;
  // display: grid;
  // grid-template-rows: 9fr 0.5fr;

  // background-image: url(${wallpaper});
  // background-size: cover;
  // background-repeat: no-repeat;

  // .windowCover {
  //     position: relative;
  //     padding: 10px;
  // }

  // .taskBarCover {
  //     position: relative;
  //     background-color: #211e3bdb;
  // }
`;

export default Main;

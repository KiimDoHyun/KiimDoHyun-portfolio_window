import styled from "styled-components";
import img from '../logo.svg'
import wallpaper from '../asset/images/wallpaper/Samsung_wallpaper.jpg'
import IconBox from "./IconBox";

const Main = (props) => {
    const {
        iconBoxArr
    } = props;
    return (
    <MainBlock>
        <div className="windowCover">
            <div className="window">
                {iconBoxArr.map((item) => <IconBox img={item.img} name={item.name} key={item.key}/>)}
            </div>
        </div>
        <div className="taskBarCover">
            <div className="taskBar">
            </div>
        </div>
    </MainBlock>
    )
}

const MainBlock = styled.div`
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
        // background: linear-gradient(to bottom right, blue, pink);
        // background: linear-gradient(to right, #282540 #211e3bdb);
        background-color: #211e3bdb;
    }

    .taskBar,
    .window {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;

        display: flex;
        flex: 1 0 auto;
        flex-wrap: wrap;
        flex-direction: column;
        gap: 5px;
    }

    .iconBox {
        width: 100px;
        height: 100px;

        padding: 10px;
        box-sizing: border-box;
        cursor: pointer;

        display: grid;
        grid-template-rows: 8fr 2fr;
        border: 2px solid #ffffff00;
    }

    .iconBox:hover {
        background-color: #bbbbbb47;
        border: 2px solid #ffffff2e;
    }

    .iconBox .iconImg {
        width: 100%;
        height: 100%;
    }
`;

export default Main;
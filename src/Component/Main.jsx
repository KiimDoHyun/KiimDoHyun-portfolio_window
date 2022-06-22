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
                <div className="box1"/>
                <div className="box2"/>
                <div className="box3">
                    <div className="icon"/>
                    <div className="dateInfo">
                        <div className="time">오후 10:31</div>
                        <div className="date">2022-06-22</div>
                    </div>
                </div>
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

    .taskBar {
        width: 100%;
        display: grid;
        grid-template-columns: 140px 1fr 120px;
    }

    .taskBar .box1 { 
        background-color:red;
    }

    .taskBar .box2 {  
        background-color:green;
    }

    .taskBar .box3 { 
        display: grid;
        grid-template-columns: 3fr 7fr;
    }
    .taskBar .box3 .icon{
    } 
    .dateInfo {
        padding: 3px;
        font-size: 13px;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
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

    .iconBox .name {
        color: white;
        font-size: 14px;
        text-shadow: 2px 2px 3px black;
    }
`;

export default Main;
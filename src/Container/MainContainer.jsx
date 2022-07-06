import { useEffect } from "react";
import Main from "../Component/Main";

const MainContainer = () => {
    const propDatas = {};
    useEffect(() => {
        console.log("메인컨테이너 렌더링 발생");
    });
    return <Main {...propDatas} />;
};

export default MainContainer;

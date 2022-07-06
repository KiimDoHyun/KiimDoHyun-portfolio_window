import React, { useEffect, useRef, useState } from "react";
import Window from "../../Component/Main/Window";
import img from "../../logo.svg";

const WindowContainer = (props) => {
    const windowRef = useRef(null);
    const [iconBoxArr] = useState([
        {
            key: 0,
            img: img,
            name: "Battle.net",
        },
    ]);

    useEffect(() => {
        console.log("윈도우 컨테이너 렌더링 발생");
    });

    useEffect(() => {
        console.log("windowRef :", windowRef);
    }, [windowRef]);

    const propDatas = {
        windowRef,
        iconBoxArr,
    };
    return <Window {...propDatas} />;
};

export default React.memo(WindowContainer);

import React, { useCallback, useEffect, useRef, useState } from "react";
import Window from "../../Component/Main/Window";
import img from "../../logo.svg";

const WindowContainer = (props) => {
    const windowRef = useRef(null);
    const [activeIcon, setActiveIton] = useState(null);
    const [iconBoxArr] = useState([
        {
            key: "battle_1",
            img: img,
            name: "Battle.net",
        },
        {
            key: "battle_2",
            img: img,
            name: "Battle.net",
        },
        {
            key: "battle_3",
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

    //
    const onClickIcon = useCallback((item) => {
        setActiveIton(item.key);
        console.log("아이템 클릭", item);
    }, []);

    const onDoubleClickIcon = useCallback((item) => {
        setActiveIton(item.key);
        console.log("아이템 더블 클릭", item);
    }, []);

    const propDatas = {
        windowRef,
        iconBoxArr,
        onClickIcon,
        onDoubleClickIcon,
    };
    return <Window {...propDatas} />;
};

export default React.memo(WindowContainer);

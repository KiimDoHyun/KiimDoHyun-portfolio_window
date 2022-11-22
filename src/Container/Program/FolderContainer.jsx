import React, { useCallback, useEffect, useRef } from "react";
import FolderComponent from "../../Component/Program/FolderComponent";
import {
    rc_program_activeProgram,
    rc_program_programList,
    rc_program_zIndexCnt,
} from "../../store/program";
import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";
import { useState } from "react";
import {
    rc_global_Directory_List,
    rc_global_Directory_Tree,
} from "../../store/global";
const displayList = [
    { value: "BIG_BIG_ICON", name: "아주 큰 아이콘" },
    { value: "BIG_ICON", name: "큰 아이콘" },
    { value: "MEDIUM_ICON", name: "보통 아이콘" },
    { value: "SMALL_ICON", name: "작은 아이콘" },
    { value: "DETAIL", name: "자세히" },
];

const FolderContainer = ({ item }) => {
    // 프로그램 리스트의 현재 아이템의 상태가 변함.
    // props 가 변하고 item으로 받는 status가 변경됨.
    // name은 변하지 않음. (고유값.)
    const { name, status } = item;
    const Directory_Tree = useRecoilValue(rc_global_Directory_Tree);
    const directory = useRecoilValue(rc_global_Directory_List);

    const setProgramList = useSetRecoilState(rc_program_programList);

    const [zIndexCnt, setZIndexCnt] = useRecoilState(rc_program_zIndexCnt);
    const temp_zIndexCnt = zIndexCnt;

    const [activeProgram, setActiveProgram] = useRecoilState(
        rc_program_activeProgram
    );
    const [isMovable, setIsMovable] = useState(false);
    const [isResizable, setIsResizable] = useState(false);
    const [isClose, setIsClose] = useState(false);
    const [isMaxSize, setIsMaxSize] = useState(false);

    // 현재 폴더 정보 (초기엔 바탕화면에서 클릭한 아이템.)
    const [currentFolder, setCurrentFolder] = useState(
        directory.find((findItem) => item.name === findItem.name)
    );

    // 현재 폴더에서 보여줄 컨텐츠 (초기엔 바탕화면에서 클릭한 아이템의 컨텐츠)
    const [folderContents, setFolderContents] = useState(
        Directory_Tree[item.name] || []
    );
    const [folderHistory, setFolderHistory] = useState([item.contents]);

    const [selectedItem, setSelectedItem] = useState(""); // 클릭한 아이템

    const [displayType, setDisplayType] = useState(displayList[2].value);

    // 보기 유형
    const prevPos = useRef();
    const boxRef = useRef();

    // 현재 창 클릭
    const onClick = useCallback(() => {
        setActiveProgram(name);
    }, [setActiveProgram, name]);

    // 최대화
    const onClickMax = useCallback(() => {
        // setProgramList((prev) =>
        //     prev.map((prevItem) =>
        //         prevItem.name === name
        //             ? { ...prevItem, status: "active_max" }
        //             : { ...prevItem }
        //     )
        // );

        setIsMaxSize(true);
        boxRef.current.style.transition = "0.25s";
        boxRef.current.style.left = "0";
        boxRef.current.style.top = "0";

        localStorage.setItem(`${name}width`, "100vw");
        localStorage.setItem(`${name}height`, "calc(100vh - 50px)");

        boxRef.current.style.width = "100vw";
        boxRef.current.style.height = "calc(100vh - 50px)";
    }, [setIsMaxSize, setProgramList]);

    // 기본 크기
    const onClickNormalSize = useCallback(() => {
        setIsMaxSize(false);
        // setProgramList((prev) =>
        //     prev.map((prevItem) =>
        //         prevItem.name === name
        //             ? { ...prevItem, status: "active" }
        //             : { ...prevItem }
        //     )
        // );
        const left = localStorage.getItem(`${name}Left`);
        const top = localStorage.getItem(`${name}Top`);
        boxRef.current.style.transition = "0.25s";

        if (left && top) {
            boxRef.current.style.left = left + "px";
            boxRef.current.style.top = top + "px";
        } else {
            boxRef.current.style.left = "calc(50vw - 250px)";
            boxRef.current.style.top = "calc(50vh - 250px)";
        }
        localStorage.setItem(`${name}width`, "500px");
        localStorage.setItem(`${name}height`, "500px");

        boxRef.current.style.width = "500px";
        boxRef.current.style.height = "500px";
    }, [setIsMaxSize, setProgramList]);

    // 최소화
    const onClickMin = useCallback(() => {
        setProgramList((prev) =>
            prev.map((prevItem) =>
                prevItem.name === name
                    ? { ...prevItem, status: "min" }
                    : { ...prevItem }
            )
        );
    }, [name, setProgramList]);

    // 닫기
    const onClickClose = useCallback(() => {
        setIsClose(true);
        boxRef.current.style.transition = "0.25s";
        boxRef.current.style.opacity = "0";

        setTimeout(() => {
            setProgramList((prev) => prev.filter((item) => item.name !== name));
        }, [300]);
    }, [name, setProgramList]);

    // 이동 활성화
    const onMouseDown = useCallback(
        (e) => {
            setIsMovable(true);
            prevPos.current = {
                X: e.clientX,
                Y: e.clientY,
            };
        },
        [setIsMovable]
    );

    // 이동
    const onMouseMove = useCallback(
        (e) => {
            // if (e.clientY <= 0) {
            //     console.log("exit");
            //     return;
            // }
            // 이전 좌표와 현재 좌표 차이값
            if (isMovable) {
                const posX = prevPos.current.X - e.clientX;
                const posY = prevPos.current.Y - e.clientY;

                // 현재 좌표가 이전 좌표로 바뀜
                prevPos.current = {
                    X: e.clientX,
                    Y: e.clientY,
                };

                // left, top으로 이동

                boxRef.current.style.transition = "0s";

                localStorage.setItem(
                    `${name}Left`,
                    boxRef.current.offsetLeft - posX
                );
                localStorage.setItem(
                    `${name}Top`,
                    boxRef.current.offsetTop - posY
                );

                boxRef.current.style.left =
                    boxRef.current.offsetLeft - posX + "px";
                boxRef.current.style.top =
                    boxRef.current.offsetTop - posY + "px";
            }

            if (isResizable) {
                /*
                    posX 에 이전과 커서 위치 차이값이 들어있다.

                    마우스가 움직이면서 이전 좌표값을 갱신한다

                    차이값 만큼 width, height 값을 계산한다

                    만약 최소값보다 큰 경우만 값을 갱신한다

                    만약 최소값 이하로 내려가려한다면?

                    커서값은 계속 갱신된다. (현재 위치좌표로)

                    커서가 오른쪽으로 움직이는 순간

                    좌표 값 차이만큼 width 값이 변한다
                    이때 커서는 한참 왼쪽에있다.

                    커서가 다시 원래 위치로 오고 나서 값 계산에 따른 너비를 갱신해야한다.

                    원래위치는 최소 값에 도달한 위치를 말한다.

                    크기 조정함수 공통화 필요
                    
                */

                // 커서의 이전 위치를 기반으로 어느 방향으로 움직일지 체크
                boxRef.current.style.transition = "0s";
                const posX = prevPos.current.X - e.clientX;
                const posY = prevPos.current.Y - e.clientY;

                // 크기 값 갱신
                const newWidth = boxRef.current.offsetWidth - posX;
                const newHeight = boxRef.current.offsetHeight - posY;

                // ====================
                // 상
                if (posX === 0 && posY > 0) {
                    if (newHeight < 60) {
                    } else {
                        localStorage.setItem(
                            `${name}height`,
                            `${boxRef.current.offsetHeight - posY}px`
                        );

                        boxRef.current.style.height =
                            boxRef.current.offsetHeight - posY + "px";

                        // 현재 좌표가 이전 좌표로 바뀜
                        prevPos.current.Y = e.clientY;
                    }
                }
                // 하
                else if (posX === 0 && posY < 0) {
                    if (prevPos.current.Y <= e.clientY) {
                        localStorage.setItem(
                            `${name}height`,
                            `${boxRef.current.offsetHeight - posY}px`
                        );

                        boxRef.current.style.height =
                            boxRef.current.offsetHeight - posY + "px";

                        // 현재 좌표가 이전 좌표로 바뀜
                        prevPos.current.Y = e.clientY;
                    }
                }
                // 좌
                else if (posX > 0 && posY === 0) {
                    if (newWidth < 300) {
                    } else {
                        localStorage.setItem(
                            `${name}width`,
                            `${boxRef.current.offsetWidth - posX}px`
                        );

                        boxRef.current.style.width =
                            boxRef.current.offsetWidth - posX + "px";

                        // 현재 좌표가 이전 좌표로 바뀜
                        prevPos.current.X = e.clientX;
                        //
                    }
                }
                // 우
                else if (posX < 0 && posY === 0) {
                    if (prevPos.current.X <= e.clientX) {
                        localStorage.setItem(
                            `${name}width`,
                            `${boxRef.current.offsetWidth - posX}px`
                        );

                        boxRef.current.style.width =
                            boxRef.current.offsetWidth - posX + "px";
                        // 마우스 위치..

                        // 현재 좌표가 이전 좌표로 바뀜
                        prevPos.current.X = e.clientX;
                    }
                }
                // 왼쪽 위
                else if (posX > 0 && posY > 0) {
                    if (newWidth < 300) {
                    } else {
                        localStorage.setItem(
                            `${name}width`,
                            `${boxRef.current.offsetWidth - posX}px`
                        );

                        boxRef.current.style.width =
                            boxRef.current.offsetWidth - posX + "px";

                        // 현재 좌표가 이전 좌표로 바뀜
                        prevPos.current.X = e.clientX;
                        //
                    }

                    if (newHeight < 60) {
                    } else {
                        localStorage.setItem(
                            `${name}height`,
                            `${boxRef.current.offsetHeight - posY}px`
                        );

                        boxRef.current.style.height =
                            boxRef.current.offsetHeight - posY + "px";

                        // 현재 좌표가 이전 좌표로 바뀜
                        prevPos.current.Y = e.clientY;
                    }
                }
                // 오른쪽 위
                else if (posX < 0 && posY > 0) {
                    if (prevPos.current.X <= e.clientX) {
                        localStorage.setItem(
                            `${name}width`,
                            `${boxRef.current.offsetWidth - posX}px`
                        );

                        boxRef.current.style.width =
                            boxRef.current.offsetWidth - posX + "px";
                        // 마우스 위치..

                        // 현재 좌표가 이전 좌표로 바뀜
                        prevPos.current.X = e.clientX;
                    }

                    if (newHeight < 60) {
                    } else {
                        localStorage.setItem(
                            `${name}height`,
                            `${boxRef.current.offsetHeight - posY}px`
                        );

                        boxRef.current.style.height =
                            boxRef.current.offsetHeight - posY + "px";

                        // 현재 좌표가 이전 좌표로 바뀜
                        prevPos.current.Y = e.clientY;
                    }
                }
                // 왼쪽 아래
                else if (posX > 0 && posY < 0) {
                    if (newWidth < 300) {
                    } else {
                        localStorage.setItem(
                            `${name}width`,
                            `${boxRef.current.offsetWidth - posX}px`
                        );

                        boxRef.current.style.width =
                            boxRef.current.offsetWidth - posX + "px";

                        // 현재 좌표가 이전 좌표로 바뀜
                        prevPos.current.X = e.clientX;
                        //
                    }

                    if (prevPos.current.Y <= e.clientY) {
                        localStorage.setItem(
                            `${name}height`,
                            `${boxRef.current.offsetHeight - posY}px`
                        );

                        boxRef.current.style.height =
                            boxRef.current.offsetHeight - posY + "px";

                        // 현재 좌표가 이전 좌표로 바뀜
                        prevPos.current.Y = e.clientY;
                    }
                }
                // 오른쪽 아래
                else if (posX < 0 && posY < 0) {
                    if (prevPos.current.X <= e.clientX) {
                        localStorage.setItem(
                            `${name}width`,
                            `${boxRef.current.offsetWidth - posX}px`
                        );

                        boxRef.current.style.width =
                            boxRef.current.offsetWidth - posX + "px";
                        // 마우스 위치..

                        // 현재 좌표가 이전 좌표로 바뀜
                        prevPos.current.X = e.clientX;
                    }

                    if (prevPos.current.Y <= e.clientY) {
                        localStorage.setItem(
                            `${name}height`,
                            `${boxRef.current.offsetHeight - posY}px`
                        );

                        boxRef.current.style.height =
                            boxRef.current.offsetHeight - posY + "px";

                        // 현재 좌표가 이전 좌표로 바뀜
                        prevPos.current.Y = e.clientY;
                    }
                }
            }
        },
        [isMovable, isResizable]
    );

    // 이동 종료
    const onMouseUp = useCallback(() => {
        setIsMovable(false);
    }, []);

    // 현재 창 맨 앞으로
    useEffect(() => {
        if (activeProgram === name) {
            boxRef.current.style.zIndex = temp_zIndexCnt + 1;
            setZIndexCnt((prev) => prev + 1);
        }
    }, [activeProgram, name, setZIndexCnt]);

    // 이동 활성화
    useEffect(() => {
        document.addEventListener("mousemove", onMouseMove);

        // 마우스 클릭이 종료되는 경우 모든 이벤트 종료 처리 필요
        document.addEventListener("mouseup", () => setIsResizable(false));

        return () => {
            document.removeEventListener("mousemove", onMouseMove);
        };
    }, [onMouseMove]);

    useEffect(() => {
        if (status === "active") {
            if (isMaxSize) {
                boxRef.current.style.left = "0px";
                boxRef.current.style.top = "0px";
            } else {
                const left = localStorage.getItem(`${name}Left`);
                const top = localStorage.getItem(`${name}Top`);

                //
                if (left && top) {
                    boxRef.current.style.left = left + "px";
                    boxRef.current.style.top = top + "px";
                } else {
                    boxRef.current.style.left = "calc(50vw - 250px)";
                    boxRef.current.style.top = "calc(50vh - 250px)";
                }
            }
        }
    }, [status, isMaxSize, boxRef]);

    useEffect(() => {
        /*
        min
        active
        */

        // 활성화
        if (status === "active") {
            boxRef.current.style.transition = "0.25s";
            boxRef.current.style.opacity = "1";

            const height = localStorage.getItem(`${name}height`);
            const width = localStorage.getItem(`${name}width`);

            if (height && width) {
                boxRef.current.style.height = height;
                boxRef.current.style.width = width;
            } else {
                boxRef.current.style.width = "500px";
                boxRef.current.style.height = "500px";
            }

            boxRef.current.style.scale = "1";
        }
        // 최소화
        else if (status === "min") {
            boxRef.current.style.transition = "0.25s";
            boxRef.current.style.opacity = "0";
            boxRef.current.style.left = "80px";
            boxRef.current.style.top = "60vh";
            boxRef.current.style.scale = "0.6";
            boxRef.current.style.width = "500px";
            boxRef.current.style.height = "500px";
        }
    }, [status]);

    const onMouseDown_Resize = useCallback((e) => {
        setIsResizable(true);
        prevPos.current = {
            X: e.clientX,
            Y: e.clientY,
        };
    }, []);

    const onMouseMove_Resize = useCallback(() => {
        //
    }, []);

    const onMouseUp_Resize = useCallback(() => {
        //
        setIsResizable(false);
    }, []);

    // 특정 아이템 클릭
    const onClickItem = useCallback((name) => {
        setSelectedItem(name);
    }, []);

    // 특정 아이템 더블 클릭
    /*
    현재 위치를 해당 아이템으로 변경한다.
    */
    const onDoubleClickItem = useCallback(
        (item) => {
            if (item.type === "FOLDER") {
                setCurrentFolder(
                    directory.find((findItem) => item.name === findItem.name)
                );
                setFolderContents(Directory_Tree[item.name] || []);
            }

            //     // 이동 기록에 없는 경우만 추가한다.
            //     if (
            //         !folderHistory.some(
            //             (someItem) => someItem.name === item.name
            //         )
            //     ) {
            //         setFolderHistory((prev) => [...prev, item.contents]);
            //     }
            //     setFolderContents(item.contents);
            // }
        },
        [Directory_Tree, folderHistory, directory]
    );

    // 뒤로 가기
    /*
    현재 위치를 현재 아이템의 부모로 변경한다.
    */
    const onClickLeft = useCallback(() => {
        if (!currentFolder.parent) return;

        setFolderContents(Directory_Tree[currentFolder.parent]);
        if (currentFolder.parent === "KDH") {
            setCurrentFolder({
                route: "/ KDH",
            });
        } else {
            setCurrentFolder(
                directory.find((item) => item.name === currentFolder.parent)
            );
        }
    }, [setFolderContents, currentFolder, Directory_Tree]);

    // 미구현
    const onClickRight = useCallback(() => {
        // setFolderContents(folderHistory[folderHistory.length - 1]);
        //
    }, []);

    useEffect(() => {
        return () => {
            localStorage.removeItem(`${name}Left`);
            localStorage.removeItem(`${name}Top`);
            localStorage.removeItem(`${name}width`);
            localStorage.removeItem(`${name}height`);
        };
    }, []);

    const propDatas = {
        onClick,
        onClickClose,
        onClickMax,
        onClickNormalSize,
        onClickMin,
        onMouseDown,
        onMouseUp,
        onMouseDown_Resize,
        onMouseUp_Resize,
        onClickItem,
        onDoubleClickItem,
        onClickLeft,
        onClickRight,
        setDisplayType,

        boxRef,
        isClose,
        isMaxSize,
        item,
        selectedItem,
        folderContents,
        displayType,
        displayList,
        currentFolder,
    };
    return <FolderComponent {...propDatas} />;
};

export default React.memo(FolderContainer);

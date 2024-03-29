import React, { useCallback, useMemo, useRef, useState } from "react";
import TaskBar from "../../Component/Main/TaskBar";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
    rc_program_activeProgram,
    rc_program_programList,
} from "../../store/program";
import {
    rc_taskbar_hiddenIcon_active,
    rc_taskbar_infoBar_active,
    rc_taskbar_preview_active,
    rc_taskbar_statusBar_active,
    rc_taskbar_timeBar_active,
} from "../../store/taskbar";

import useGetCurrentTime from "../../hooks/useGetCurrentTime";

const glowLevelArr = [
    "", // none
    "#ffffff0d", // 호버
    "#ffffff24", // active
    "#ffffff2b", //호버 + active:
];

const TaskBarContainer = () => {
    const {
        year: cur_year,
        month: cur_month,
        date: cur_date,
        hour: cur_hour,
        min: cur_minute,
        timeLine: cur_timeline,
    } = useGetCurrentTime();

    const [hiddenIcon, setHiddenIcon] = useRecoilState(
        rc_taskbar_hiddenIcon_active
    );
    const setPreview = useSetRecoilState(rc_taskbar_preview_active);
    const setActiveStatusBar = useSetRecoilState(rc_taskbar_statusBar_active);
    const setActiveInfoBar = useSetRecoilState(rc_taskbar_infoBar_active);
    const [programList, setProgramList] = useRecoilState(
        rc_program_programList
    );
    const setActiveTimeBar = useSetRecoilState(rc_taskbar_timeBar_active);

    const [activeProgram, setActiveProgram] = useRecoilState(
        rc_program_activeProgram
    );

    // const setActiveProgram = useSetRecoilState(rc_program_activeProgram);
    const [hoverTarget, setHoverTarget] = useState({ name: "", idx: -1 });

    const box2Ref = useRef(null);

    const PreViewComponent = useMemo(() => {
        const target = programList.find(
            (findItem) => findItem.name === hoverTarget.name
        );

        return target;
    }, [programList, hoverTarget]);

    // 미리보기 삭제 버튼 이벤트
    const onClick_Close_ShortCut = useCallback(() => {
        // 현재 hover 상태인 아이템 정보를 이용해서 특정 프로그램을 제거한다.
        const { name } = hoverTarget;
        setProgramList((prevState) =>
            prevState.filter((filterItem) => filterItem.name !== name)
        );
        setHoverTarget({ name: "", idx: -1 });
    }, [hoverTarget, setProgramList]);

    // 미리보기
    const showPrev = useCallback(() => {
        // Test
        // return (
        //     <ProgramContainer
        //         item={{
        //             icon: "",
        //             name: "기술스택",
        //             parent: "root",
        //             status: "active",
        //             type: "FOLDER",
        //         }}
        //     />
        // );
        const target = programList.find(
            (findItem) => findItem.name === hoverTarget.name
        );

        if (target) {
            const Component = target.Component;
            // target 상태가 '최소화' 상태인 경우 미리보기에서 안보이기 때문에
            // 찾은 target의 상태는 항상 active로 설정한다.
            return <Component item={{ ...target, status: "active" }} />;
        } else {
            return null;
        }
    }, [programList, hoverTarget]);

    // 마우스 오버
    const onMouseEnter = useCallback(
        ({ name }, idx) => {
            setPreview(true);
            // 현재 활성화된 아이템은 최대 밝기로
            if (box2Ref.current.children[idx].title === activeProgram) {
                box2Ref.current.children[idx].style.backgroundColor =
                    glowLevelArr[3];
            }
            // 일반 아이템은 기본 밝기로
            else {
                box2Ref.current.children[idx].style.backgroundColor =
                    glowLevelArr[1];
            }
            setHoverTarget({ name, idx });
        },
        [activeProgram, setPreview]
    );

    // 마우스 아웃
    const onMouseLeave = useCallback(
        (e, idx) => {
            setPreview(false);
            // 밝기를 가장 낮춘다
            // 이미 활성화된 아이템은 기본 밝기를 가지고있기 때문에 사라지지 않는다
            box2Ref.current.children[idx].style.backgroundColor =
                glowLevelArr[0];
            setHoverTarget({ name: "", idx: -1 });
        },
        [setPreview]
    );

    // 아이템 클릭
    // 버그 방지를 위해 이미지 크기에서만 이벤트가 발생한다.
    const onClickTaskIcon = useCallback(
        (item, idx) => {
            // setHoverTarget(item.key);
            // setActiveProgram(item.key);

            // 최소화 되었던 아이템을 활성화 시킨다
            if (item.status === "min") {
                setProgramList((prev) =>
                    prev.map((prevItem) =>
                        prevItem.name === item.name
                            ? { ...prevItem, status: "active" }
                            : { ...prevItem }
                    )
                );
                box2Ref.current.children[idx].style.backgroundColor =
                    glowLevelArr[2];
                setActiveProgram(item.name);
            } else {
                // 현재 가장 앞에있는 아이템이면 최소화 시킨다.
                if (item.name === activeProgram) {
                    setProgramList((prev) =>
                        prev.map((prevItem) =>
                            prevItem.name === item.name
                                ? { ...prevItem, status: "min" }
                                : { ...prevItem }
                        )
                    );
                    setActiveProgram("");
                }
                // 현재 가장 앞에있는 아이템이 아니면 가장앞으로 이동만 시킨다.
                else {
                    box2Ref.current.children[idx].style.backgroundColor =
                        glowLevelArr[2];
                    setActiveProgram(item.name);
                }
            }

            // setHoverTarget(item.key);
        },
        [setActiveProgram, setProgramList, activeProgram]
    );

    // 시작 아이콘 클릭
    const onClickStartIcon = useCallback(() => {
        setActiveStatusBar((prev) => !prev);

        setActiveTimeBar(false);
        setActiveInfoBar(false);
        setHiddenIcon(false);
    }, [setActiveStatusBar, setActiveInfoBar, setActiveTimeBar, setHiddenIcon]);

    // 시간 클릭
    const onClickTime = useCallback(() => {
        setActiveTimeBar((prev) => !prev);

        setActiveInfoBar(false);
        setActiveStatusBar(false);
        setHiddenIcon(false);
    }, [setActiveStatusBar, setActiveInfoBar, setActiveTimeBar, setHiddenIcon]);

    // 정보 바 클릭
    const onClickInfo = useCallback(() => {
        setActiveInfoBar((prev) => !prev);

        setHiddenIcon(false);
        setActiveTimeBar(false);
        setActiveStatusBar(false);
    }, [setActiveStatusBar, setActiveInfoBar, setActiveTimeBar, setHiddenIcon]);

    // 숨겨진 아이콘 클릭
    const onClickHiddenIcon = useCallback(() => {
        setHiddenIcon((prev) => !prev);

        setActiveStatusBar(false);
        setActiveTimeBar(false);
        setActiveInfoBar(false);
    }, [setActiveStatusBar, setActiveInfoBar, setActiveTimeBar, setHiddenIcon]);

    // 모두 닫기
    const onClickCloseAll = useCallback(() => {
        setActiveInfoBar(false);
        setActiveTimeBar(false);
        setHiddenIcon(false);
        setActiveStatusBar(false);
        setProgramList((prev) =>
            prev.map((prevItem) => ({ ...prevItem, status: "min" }))
        );
    }, [
        setActiveStatusBar,
        setActiveInfoBar,
        setActiveTimeBar,
        setHiddenIcon,
        setProgramList,
    ]);

    // useEffect(() => {
    //     var userLang = navigator.language || navigator.userLanguage;
    //     console.log("The language is: " + userLang);
    //     const online = window.navigator.onLine;
    //     if (online) {
    //         console.log("Online :D");
    //     } else {
    //         console.log("Offline :(");
    //     }
    // }, []);

    const propDatas = {
        onClickStartIcon,
        onClickTime,
        onClickInfo,
        onClickHiddenIcon,

        hoverTarget,
        programList,
        activeProgram,
        hiddenIcon,

        onMouseEnter,
        onMouseLeave,
        onClickTaskIcon,
        onClickCloseAll,
        showPrev,
        onClick_Close_ShortCut,

        cur_year,
        cur_month,
        cur_date,
        cur_hour,
        cur_minute,
        cur_timeline,

        box2Ref,
        PreViewComponent,
    };

    return <TaskBar {...propDatas} />;
};

export default TaskBarContainer;

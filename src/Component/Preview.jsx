import React from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { rc_taskbar_preview_active } from "../store/taskbar";

const Preview = () => {
    const active = useRecoilValue(rc_taskbar_preview_active);
    // const programList = useRecoilValue(rc_program_programList);

    // const activeProgram = useRecoilValue(rc_program_activeProgram);

    // const target = useMemo(() => {
    //     const targetItem = programList.find((el) => el.key === activeProgram);
    //     const targetIdx = programList.findIndex(
    //         (el) => el.key === activeProgram
    //     );
    //     return { ...targetItem, idx: targetIdx };
    // }, [programList, activeProgram]);

    // console.log("target: ", target);
    // 현재 호버된 아이템에 따른 위치 변화
    return <PreviewBlock active={active}>Preview</PreviewBlock>;
};

// 활성화 인덱스: idx
// idx - 1 * 50 만큼 왼쪽에서 생성되면 된다.
// 75 125 175
const PreviewBlock = styled.div`
    position: absolute;
    left: 25px;
    left: ${(props) => {
            if (props.active) {
                return 25 + 25 * props.idx;
            } else {
                return 0;
            }
        }}
        px;
    bottom: ${(props) => (props.active ? "50px" : "27px")};
    opacity: ${(props) => (props.active ? "1" : "0")};
    background-color: #393a3be0;
    z-index: ${(props) => (props.active ? "99999" : "0")};

    width: 200px;
    height: 150px;

    transition: 0.2s;
`;
export default Preview;

import { useCallback } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
    rc_program_activeProgram,
    rc_program_programList,
    rc_program_zIndexCnt,
} from "../store/program";

/*
특정 프로그램, 리스트의 클릭을 통해 특정 프로그램의 활성화를 위한 이벤트
*/
const useActiveProgram = () => {
    const [programList, setProgramList] = useRecoilState(
        rc_program_programList
    );
    const setZIndexCnt = useSetRecoilState(rc_program_zIndexCnt);
    const setActiveProgram = useSetRecoilState(rc_program_activeProgram);

    const activeProgram = useCallback(
        (item) => {
            // 만약 이미 열었던 거라면 (지금 열려있는지, 최소화 상태인지)
            let target = programList.find(
                (listItem) => listItem.name === item.name
            );
            if (target) {
                // 열려있는데 최소화 상태라면
                if (target.status === "min") {
                    setProgramList((prev) =>
                        prev.map((prevItem) =>
                            prevItem.name === target.name
                                ? { ...prevItem, status: "active" }
                                : { ...prevItem }
                        )
                    );
                    // 다시 크기를 키우고 맨앞으로 이동시킨다.
                }
                // 열려 있는 상태라면
                else if (target.status === "min") {
                    // 맨앞으로 이동시킨다.
                }
                setActiveProgram(item.name);
                setZIndexCnt((prev) => prev + 1);
            }
            // 처음 여는거라면
            else {
                import("../Container/Program/ProgramContainer").then((obj) => {
                    const Component = obj.default;
                    setProgramList((prev) => [
                        ...prev,
                        {
                            Component,
                            status: "active",
                            ...item,
                            // key: item.key,
                            // icon: item.icon,
                        },
                    ]);
                    // setProgramList([
                    //     ...programList,
                    //     {
                    //         Component,
                    //         status: "active",
                    //         ...item,
                    //         // key: item.key,
                    //         // icon: item.icon,
                    //     },
                    // ]);
                    setActiveProgram(item.name);
                    setZIndexCnt((prev) => prev + 1);
                });
            }
        },
        [programList, setProgramList, setZIndexCnt, setActiveProgram]
    );
    return activeProgram;
};

export default useActiveProgram;

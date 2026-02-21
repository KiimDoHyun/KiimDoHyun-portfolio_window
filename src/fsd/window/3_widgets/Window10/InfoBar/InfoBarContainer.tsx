import React from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { getCommitApi } from "../../../../../api/git";
import InfoBar from "./components/InfoBar";
import { useAxios } from "@fsd/window/6_common/hooks";
import { rc_global_DisplayLight } from "@store/global";
import { rc_taskbar_infoBar_active } from "@store/taskbar";

const InfoBarContainer = () => {
    const active = useRecoilValue(rc_taskbar_infoBar_active);
    const [commit, getCommit] = useAxios(getCommitApi);
    const [displayLight, setDisplayLight] = useRecoilState(
        rc_global_DisplayLight
    );

    // 화면밝기 조정 이벤트
    const onChange = useCallback(
        ({ target: { value } }) => {
            setDisplayLight(value);
        },
        [setDisplayLight]
    );

    // 인포 바 활성화시 커밋 조회
    useEffect(() => {
        if (active) {
            getCommit();
        }
    }, [active, getCommit]);

    const propDatas = {
        active,
        commit,
        displayLight,
        onChange,
    };
    return <InfoBar {...propDatas} />;
};

export default InfoBarContainer;

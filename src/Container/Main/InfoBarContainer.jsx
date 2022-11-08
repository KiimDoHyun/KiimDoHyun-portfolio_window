import React from "react";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { getCommitApi } from "../../api/git";
import InfoBar from "../../Component/InfoBar";
import useAxios from "../../hooks/useAxios";
import { rc_taskbar_infoBar_active } from "../../store/taskbar";

const InfoBarContainer = () => {
    const active = useRecoilValue(rc_taskbar_infoBar_active);
    const [commit, getCommit] = useAxios(getCommitApi);

    useEffect(() => {
        if (active) {
            getCommit();
        }
    }, [active, getCommit]);

    const propDatas = {
        active,
        commit,
    };
    return <InfoBar {...propDatas} />;
};

export default InfoBarContainer;

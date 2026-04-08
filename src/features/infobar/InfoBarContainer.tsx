import React from "react";
import { useEffect } from "react";
import { getCommitApi } from "@shared/api/git";
import InfoBar from "./components/InfoBar";
import useAxios from "@shared/hooks/useAxios";

type InfoBarContainerProps = {
    active: boolean;
    displayLight: number;
    onChangeDisplayLight: (next: number) => void;
};

const InfoBarContainer = ({
    active,
    displayLight,
    onChangeDisplayLight,
}: InfoBarContainerProps) => {
    const [commit, getCommit] = useAxios(getCommitApi);

    // 화면밝기 조정 이벤트
    const onChange = ({ target: { value } }: { target: { value: string } }) => {
        onChangeDisplayLight(Number(value));
    };

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

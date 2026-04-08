import React from "react";
import { useEffect } from "react";
import { getCommitApi } from "@shared/api/git";
import InfoBarView from "./components/InfoBar";
import useAxios from "@shared/hooks/useAxios";

type InfoBarProps = {
    active: boolean;
    displayLight: number;
    onChangeDisplayLight: (next: number) => void;
};

const InfoBar = ({
    active,
    displayLight,
    onChangeDisplayLight,
}: InfoBarProps) => {
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
    return <InfoBarView {...propDatas} />;
};

export default InfoBar;

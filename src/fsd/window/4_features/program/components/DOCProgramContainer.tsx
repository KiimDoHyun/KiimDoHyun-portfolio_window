import React, { useMemo } from "react";
import { projectDatas } from "@Common/data";
import DOCProgramComponent from "./DOCProgramComponent";

const DOCProgramContainer = ({ type, name }) => {
    /*
    문서형

    현재 프로그램이 문서형이라면

    문서 정보를 가져온다.

    문서정보는 변경되지 않는다.
    */
    const DOCData = useMemo(() => {
        if (type !== "DOC") return null;

        const target = projectDatas.find(
            (findItem) => findItem.projectName === name
        );
        console.log("target", target);
        return { data: target, keys: Object.keys(target) || [] };
    }, [type, name]);

    const propDatas = {
        type,
        DOCData,
    };
    return <DOCProgramComponent {...propDatas} />;
};

export default DOCProgramContainer;

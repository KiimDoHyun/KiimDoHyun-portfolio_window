import React from "react";
import InfoProgramView from "./InfoProgram.view";

interface InfoProgramProps {
    type: string;
}

const InfoProgram = ({ type }: InfoProgramProps) => {
    const propDatas = { type };
    return <InfoProgramView {...propDatas} />;
};

export default InfoProgram;

import React from "react";
import InfoProgramView from "./InfoProgram.view";

const InfoProgram = ({ type }) => {
    const propDatas = { type };
    return <InfoProgramView {...propDatas} />;
};

export default InfoProgram;

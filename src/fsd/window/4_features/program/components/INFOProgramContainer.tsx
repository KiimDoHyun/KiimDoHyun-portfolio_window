import React from "react";
import INFOProgramComponent from "./INFOProgramComponent";

const INFOProgramContainer = ({ type }) => {
    const propDatas = { type };
    return <INFOProgramComponent {...propDatas} />;
};

export default INFOProgramContainer;

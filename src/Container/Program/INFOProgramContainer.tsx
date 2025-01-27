import React from "react";
import INFOProgramComponent from "../../Component/Program/INFOProgramComponent";

const INFOProgramContainer = ({ type }) => {
    const propDatas = { type };
    return <INFOProgramComponent {...propDatas} />;
};

export default INFOProgramContainer;

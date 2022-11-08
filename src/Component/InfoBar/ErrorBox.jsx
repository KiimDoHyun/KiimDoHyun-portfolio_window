import React from "react";
import styled from "styled-components";

const ErrorBox = () => {
    return (
        <ErrorBoxBlock>
            <div>Commit 정보를 가져오는데 실패했습니다.</div>
        </ErrorBoxBlock>
    );
};

const ErrorBoxBlock = styled.div`
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    color: #a9a9a9;
    cursor: default;
`;
export default React.memo(ErrorBox);

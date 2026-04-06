import React from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { rc_global_Directory_List } from "@store/global";

const RightAreaBox = ({ item, img, name, onClick }) => {
    const directory = useRecoilValue(rc_global_Directory_List);
    return (
        <RightAreaBoxBlock
            className="statusBox"
            onClick={() => {
                if (item) {
                    onClick(
                        directory.find(
                            (findItem) => findItem.name === item.parent
                        )
                    );
                }
            }}
        >
            <img src={img} alt="name" />
            <div className="text">{name}</div>
        </RightAreaBoxBlock>
    );
};

const RightAreaBoxBlock = styled.div`
    flex-basis: 32%;
    height: 100px;
    background-color: #ffffff14;

    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #9b9b9b00;

    box-sizing: border-box;
    padding: 10px;

    position: relative;

    :hover {
        border: 2px solid #9b9b9b;
    }

    img {
        width: 50%;
        height: 50%;
    }

    .text {
        position: absolute;
        bottom: 5px;
        left: 2px;
        font-size: 11px;
        font-weight: lighter;
        color: #e8e8e8;
        cursor: default;
    }
`;
export default React.memo(RightAreaBox);

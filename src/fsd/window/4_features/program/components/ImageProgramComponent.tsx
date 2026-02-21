import plus from "@images/icons/plus_line.png";
import minus from "@images/icons/minus_line.png";
import rotate_left from "@images/icons/rotate_left_line.png";
import rotate_right from "@images/icons/rotate_right_line.png";
import image_defaultSize from "@images/icons/image_defaultSize_line.png";

import collapseArrowLeft from "@images/icons/collapse-arrow-left-white.png";
import collapseArrowRight from "@images/icons/collapse-arrow-right-white.png";
import styled from "styled-components";
import React from "react";

const ImageProgramComponent = ({
    type,
    imageArr,
    refImage,
    curImageIdx,
    currentImage_sizeRate,

    onClickM_Image_ScaleUp,
    onClickM_Image_ScaleDown,
    onClickM_Image_Rotate_Right,
    onClickM_Image_Rotate_Left,
    onClickM_Image_Default,
    IMG_onClickLeft,
    IMG_onClickRight,
}) => {
    return (
        <React.Fragment>
            <FolderProgramHeaderBlock className={`headerArea2`}>
                <div
                    className="image_header_controller_btn"
                    onClick={onClickM_Image_ScaleUp}
                    title="이미지 확대"
                >
                    <img src={plus} alt="확대" />
                </div>
                <div
                    className="image_header_controller_btn"
                    onClick={onClickM_Image_ScaleDown}
                    title="이미지 축소"
                >
                    <img src={minus} alt="축소" />
                </div>
                <div
                    className="image_header_controller_btn"
                    onClick={onClickM_Image_Rotate_Right}
                    title="왼쪽으로 회전"
                >
                    <img src={rotate_left} alt="회전_좌" />
                </div>
                <div
                    className="image_header_controller_btn"
                    onClick={onClickM_Image_Rotate_Left}
                    title="오른쪽으로 회전"
                >
                    <img src={rotate_right} alt="회전_우" />
                </div>
                <div
                    className="image_header_controller_btn"
                    onClick={onClickM_Image_Default}
                    title="기본 설정으로"
                >
                    <img src={image_defaultSize} alt="화면맞춤" />
                </div>
                <div className="image_haeder_controller_number">
                    {Math.round(currentImage_sizeRate * 100)} %
                </div>
            </FolderProgramHeaderBlock>
            <FolderProgramContentBlock className={`contentsArea_Cover`}>
                <div className="contentsArea_image">
                    <div
                        className="image_arrow image_arrowLeft"
                        title="이전"
                        onClick={IMG_onClickLeft}
                    >
                        <img src={collapseArrowLeft} alt="collapseArrowLeft" />
                    </div>
                    <div
                        className="image_arrow image_arrowRight"
                        title="다음"
                        onClick={IMG_onClickRight}
                    >
                        <img
                            src={collapseArrowRight}
                            alt="collapseArrowRight"
                        />
                    </div>

                    {imageArr.length > 0 && (
                        <img
                            className="imageContent"
                            ref={refImage}
                            // src={item.icon}
                            src={imageArr[curImageIdx].icon}
                            alt={imageArr[curImageIdx].name}
                        />
                    )}
                </div>
            </FolderProgramContentBlock>
            <div className="bottomArea">
                {curImageIdx + 1} / {imageArr.length}{" "}
                {imageArr[curImageIdx] && imageArr[curImageIdx].name}
            </div>
        </React.Fragment>
    );
};
const FolderProgramHeaderBlock = styled.div`
    justify-content: center !important;
    gap: 30px !important;

    .image_header_controller_btn {
        width: 20px;
        height: 20px;

        padding: 1px;
        box-sizing: border-box;

        transition: 0.2s;
    }

    .image_header_controller_btn:hover {
        background-color: #e6e6e6;
    }

    .image_header_controller_btn img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;
const FolderProgramContentBlock = styled.div`
    .contentsArea_image {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        background-color: #20343b;
    }

    .image_arrow {
        position: absolute;
        height: 100%;
        width: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: 0.2s;
    }

    .image_arrow img {
        width: 15px;
        height: 15px;
    }

    .image_arrow:hover {
        opacity: 1;
    }

    .image_arrowLeft {
        background: linear-gradient(to right, #00000029, #ffffff00);
        left: 0;
    }

    .image_arrowRight {
        background: linear-gradient(to right, #ffffff00, #00000029);
        right: 0;
    }

    .imageContent {
        width: 96px;
        height: 96px;
    }
`;

export default React.memo(ImageProgramComponent);

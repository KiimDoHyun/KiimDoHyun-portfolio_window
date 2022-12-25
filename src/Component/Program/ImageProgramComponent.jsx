import React from "react";

import plus from "../../asset/images/icons/plus_line.png";
import minus from "../../asset/images/icons/minus_line.png";
import rotate_left from "../../asset/images/icons/rotate_left_line.png";
import rotate_right from "../../asset/images/icons/rotate_right_line.png";
import image_defaultSize from "../../asset/images/icons/image_defaultSize_line.png";

import collapseArrowLeft from "../../asset/images/icons/collapse-arrow-left-white.png";
import collapseArrowRight from "../../asset/images/icons/collapse-arrow-right-white.png";

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
        <>
            <div className={`headerArea2 headerArea2_${type}`}>
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
            </div>
            <div className={`contentsArea_Cover`}>
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
            </div>
            <div className="bottomArea">
                {curImageIdx + 1} / {imageArr.length}{" "}
                {imageArr[curImageIdx] && imageArr[curImageIdx].name}
            </div>
        </>
    );
};

export default React.memo(ImageProgramComponent);

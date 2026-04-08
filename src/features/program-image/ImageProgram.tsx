import { Fragment } from "react";
import { useImageNavigation } from "./hooks/useImageNavigation";
import ImageHeader from "./ui/ImageHeader";
import ImageViewer from "./ui/ImageViewer";
import type { ImageProgramProps } from "./ImageProgram.types";

const ImageProgram = ({ id }: ImageProgramProps) => {
    const {
        imageArr,
        curImageIdx,
        currentImage_sizeRate,
        currentImage_rotate,
        onClickLeft,
        onClickRight,
        onClickScaleUp,
        onClickScaleDown,
        onClickRotateLeft,
        onClickRotateRight,
        onClickDefault,
    } = useImageNavigation({ id });

    const currentImage = imageArr[curImageIdx];

    return (
        <Fragment>
            <ImageHeader
                currentImage_sizeRate={currentImage_sizeRate}
                onClickScaleUp={onClickScaleUp}
                onClickScaleDown={onClickScaleDown}
                onClickRotateRight={onClickRotateRight}
                onClickRotateLeft={onClickRotateLeft}
                onClickDefault={onClickDefault}
            />
            <ImageViewer
                imageArr={imageArr}
                curImageIdx={curImageIdx}
                currentImage_sizeRate={currentImage_sizeRate}
                currentImage_rotate={currentImage_rotate}
                onClickLeft={onClickLeft}
                onClickRight={onClickRight}
            />
            <div className="bottomArea">
                {curImageIdx + 1} / {imageArr.length}{" "}
                {currentImage && currentImage.name}
            </div>
        </Fragment>
    );
};

export default ImageProgram;

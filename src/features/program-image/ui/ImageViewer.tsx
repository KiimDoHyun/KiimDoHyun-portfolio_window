import collapseArrowLeft from "@images/icons/collapse-arrow-left-white.png";
import collapseArrowRight from "@images/icons/collapse-arrow-right-white.png";
import type { DirectoryItem } from "@pages/DesktopPage/DesktopDataContext";
import { contentStyle } from "../ImageProgram.style";

interface ImageViewerProps {
    imageArr: Array<DirectoryItem>;
    curImageIdx: number;
    currentImage_sizeRate: number;
    currentImage_rotate: number;
    onClickLeft: () => void;
    onClickRight: () => void;
}

const ImageViewer = ({
    imageArr,
    curImageIdx,
    currentImage_sizeRate,
    currentImage_rotate,
    onClickLeft,
    onClickRight,
}: ImageViewerProps) => {
    const currentImage = imageArr[curImageIdx];
    return (
        <div className={`contentsArea_Cover ${contentStyle}`}>
            <div className="contentsArea_image">
                <div
                    className="image_arrow image_arrowLeft"
                    title="이전"
                    onClick={onClickLeft}
                >
                    <img src={collapseArrowLeft} alt="collapseArrowLeft" />
                </div>
                <div
                    className="image_arrow image_arrowRight"
                    title="다음"
                    onClick={onClickRight}
                >
                    <img src={collapseArrowRight} alt="collapseArrowRight" />
                </div>

                {imageArr.length > 0 && currentImage && (
                    <img
                        className="imageContent"
                        src={currentImage.icon}
                        alt={currentImage.name}
                        style={{
                            scale: String(currentImage_sizeRate),
                            rotate: `${currentImage_rotate}deg`,
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default ImageViewer;

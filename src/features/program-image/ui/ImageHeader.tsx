import plus from "@images/icons/plus_line.png";
import minus from "@images/icons/minus_line.png";
import rotate_left from "@images/icons/rotate_left_line.png";
import rotate_right from "@images/icons/rotate_right_line.png";
import image_defaultSize from "@images/icons/image_defaultSize_line.png";
import { headerStyle } from "../ImageProgram.style";

interface ImageHeaderProps {
    currentImage_sizeRate: number;
    onClickScaleUp: () => void;
    onClickScaleDown: () => void;
    onClickRotateRight: () => void;
    onClickRotateLeft: () => void;
    onClickDefault: () => void;
}

const ImageHeader = ({
    currentImage_sizeRate,
    onClickScaleUp,
    onClickScaleDown,
    onClickRotateRight,
    onClickRotateLeft,
    onClickDefault,
}: ImageHeaderProps) => {
    return (
        <div className={`headerArea2 ${headerStyle}`}>
            <div
                className="image_header_controller_btn"
                onClick={onClickScaleUp}
                title="이미지 확대"
            >
                <img src={plus} alt="확대" />
            </div>
            <div
                className="image_header_controller_btn"
                onClick={onClickScaleDown}
                title="이미지 축소"
            >
                <img src={minus} alt="축소" />
            </div>
            <div
                className="image_header_controller_btn"
                onClick={onClickRotateRight}
                title="왼쪽으로 회전"
            >
                <img src={rotate_left} alt="회전_좌" />
            </div>
            <div
                className="image_header_controller_btn"
                onClick={onClickRotateLeft}
                title="오른쪽으로 회전"
            >
                <img src={rotate_right} alt="회전_우" />
            </div>
            <div
                className="image_header_controller_btn"
                onClick={onClickDefault}
                title="기본 설정으로"
            >
                <img src={image_defaultSize} alt="화면맞춤" />
            </div>
            <div className="image_haeder_controller_number">
                {Math.round(currentImage_sizeRate * 100)} %
            </div>
        </div>
    );
};

export default ImageHeader;

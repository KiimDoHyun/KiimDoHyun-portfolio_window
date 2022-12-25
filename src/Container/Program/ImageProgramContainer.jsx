import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import ImageProgramComponent from "../../Component/Program/ImageProgramComponent";
import { rc_global_Directory_Tree } from "../../store/global";

// 이미지
const ImageProgramContainer = ({ type, parent, name }) => {
    const Directory_Tree = useRecoilValue(rc_global_Directory_Tree);

    // 현재 아이템의 부모의 모든 아이템중 이미지형 프로그램
    const [imageArr, setImageArr] = useState([]);
    const imageArrLength = useRef(0);

    // 현재 아이템의 인덱스
    const [curImageIdx, setCurImageIdx] = useState(0);

    // 이미지 크기 배율
    const [currentImage_sizeRate, setCurrentImage_sizeRate] = useState(1);

    // 이미지 회전 각
    const [currentImage_rotate, setCurrentImage_rotate] = useState(0);

    // 이미지 Ref
    const refImage = useRef(null);

    // 왼쪽으로 이동
    const IMG_onClickLeft = useCallback(() => {
        // 나의 부모의 자식들을 알고 있어야 좌우 이동이 가능하다.
        setCurImageIdx((prev) => (prev - 1 >= 0 ? prev - 1 : 0));
        setCurrentImage_sizeRate(1);
    }, []);

    // 오른쪽으로 이동
    const IMG_onClickRight = useCallback(() => {
        setCurImageIdx((prev) =>
            prev + 1 < imageArrLength.current
                ? prev + 1
                : imageArrLength.current - 1
        );
        setCurrentImage_sizeRate(1);
    }, []);

    // 이미지 확대
    const onClickM_Image_ScaleUp = useCallback(() => {
        setCurrentImage_sizeRate((prev) => prev + 0.2);
    }, [setCurrentImage_sizeRate]);

    // 이미지 축소
    const onClickM_Image_ScaleDown = useCallback(() => {
        setCurrentImage_sizeRate((prev) => (prev - 0.2 > 0 ? prev - 0.2 : 0));
    }, [setCurrentImage_sizeRate]);

    // 이미지 회전_왼쪽
    const onClickM_Image_Rotate_Right = useCallback(() => {
        setCurrentImage_rotate((prev) => (prev - 45) % 360);
    }, [setCurrentImage_sizeRate]);

    // 이미지 회전_오른쪽
    const onClickM_Image_Rotate_Left = useCallback(() => {
        setCurrentImage_rotate((prev) => (prev + 45) % 360);
    }, [setCurrentImage_sizeRate]);

    // 이미지 기본 설정으로 변경
    const onClickM_Image_Default = useCallback(() => {
        setCurrentImage_rotate(0);
        setCurrentImage_sizeRate(1);
    }, [setCurrentImage_sizeRate]);

    // 이미지 회전
    useEffect(() => {
        if (refImage.current) {
            refImage.current.style.rotate = `${currentImage_rotate}deg`;
        }
    }, [currentImage_rotate]);

    // 이미지 크기
    useEffect(() => {
        if (refImage.current) {
            refImage.current.style.scale = currentImage_sizeRate;
        }
    }, [currentImage_sizeRate]);

    useEffect(() => {
        // 부모의 아이템
        const parentContents = Directory_Tree[parent] || [];

        // 가공된 아이템
        const calculated_parentContents = parentContents.filter(
            (filterItem) => filterItem.type === "IMAGE"
        );
        imageArrLength.current = calculated_parentContents.length;

        setImageArr(calculated_parentContents);

        setCurImageIdx(
            calculated_parentContents.findIndex(
                (fintItem) => fintItem.name === name
            )
        );
    }, [Directory_Tree, parent, name]);

    const propDats = {
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
    };
    return <ImageProgramComponent {...propDats} />;
};

export default React.memo(ImageProgramContainer);

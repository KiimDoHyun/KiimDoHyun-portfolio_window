import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import type { ProgramId } from "@shared/types/program";
import type { WindowStatus } from "../WindowShell.types";
import { TASKBAR_HEIGHT, type Geometry } from "../lib/geometry";
import { clearGeometry, loadGeometry, saveGeometry } from "../lib/persist";

const DEFAULT_W = 500;
const DEFAULT_H = 500;

interface UseWindowLifecycleParams {
    boxRef: React.RefObject<HTMLDivElement | null>;
    id: ProgramId;
    status?: WindowStatus;
    isActive: boolean;
    onRequestZIndex: () => number;
}

/**
 * 창의 생명주기(초기 위치/크기 복원, min/active 상태 효과, 최대화/복원/닫기, z-index) 담당.
 * 위치는 transform: translate3d 로, 크기는 width/height 로 표현한다.
 */
export function useWindowLifecycle({
    boxRef,
    id,
    status,
    isActive,
    onRequestZIndex,
}: UseWindowLifecycleParams) {
    const [isMaxSize, setIsMaxSize] = useState(false);
    const [isClose, setIsClose] = useState(false);
    const isFirstActiveRef = useRef(true);

    // 활성창이 되면 z-index 를 최상단으로
    useEffect(() => {
        if (isActive && boxRef.current) {
            const next = onRequestZIndex();
            boxRef.current.style.zIndex = String(next);
        }
    }, [isActive, boxRef, onRequestZIndex]);

    // 위치/크기/opacity — status 전이.
    // useLayoutEffect 로 paint 전에 inline style 을 적용해 첫 마운트 시 (0,0) 이 보이지 않도록 한다.
    // scale 효과는 inline transform 에 통합해 박스 visual center 기준으로 적용한다
    // (별도 scale property 사용 시 transform-origin 이 layout box 에 묶여 cx, cy 의 0.1배 만큼 슬라이드되는 문제 회피).
    useLayoutEffect(() => {
        if (!boxRef.current) return;
        const box = boxRef.current;
        if (status === "active") {
            const isFirst = isFirstActiveRef.current;
            isFirstActiveRef.current = false;

            const stored = loadGeometry(id);
            const x = isMaxSize
                ? 0
                : stored?.x ?? Math.max(0, Math.floor(window.innerWidth / 2 - DEFAULT_W / 2));
            const y = isMaxSize
                ? 0
                : stored?.y ?? Math.max(0, Math.floor(window.innerHeight / 2 - DEFAULT_H / 2));
            const w = isMaxSize ? window.innerWidth : stored?.w ?? DEFAULT_W;
            const h = isMaxSize ? window.innerHeight - TASKBAR_HEIGHT : stored?.h ?? DEFAULT_H;

            if (!isMaxSize && !stored) {
                // drag/resize 가 mousedown 에서 stored 를 안전하게 읽도록 default 도 영속화
                saveGeometry(id, { x, y, w, h });
            }

            if (isFirst) {
                // 첫 마운트: 시작 시 opacity 0 + scale 0.9 (transform 통합) 로 즉시 적용
                box.style.transition = "0s";
                box.style.opacity = "0";
                box.style.transform = `translate3d(${x}px, ${y}px, 0) scale(0.9)`;
                box.style.width = `${w}px`;
                box.style.height = `${h}px`;
                // 다음 프레임에 fade-in (opacity 1 + scale 1)
                requestAnimationFrame(() => {
                    if (!boxRef.current) return;
                    boxRef.current.style.transition = "0.25s";
                    boxRef.current.style.opacity = "1";
                    boxRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                });
            } else {
                box.style.transition = "0.25s";
                box.style.opacity = "1";
                box.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                box.style.width = `${w}px`;
                box.style.height = `${h}px`;
            }
        } else if (status === "min") {
            box.style.transition = "0.25s";
            box.style.opacity = "0";
            const minY = Math.floor(window.innerHeight * 0.6);
            box.style.transform = `translate3d(80px, ${minY}px, 0) scale(0.6)`;
            box.style.width = `${DEFAULT_W}px`;
            box.style.height = `${DEFAULT_H}px`;
        }
    }, [status, isMaxSize, boxRef, id]);

    // 언마운트 시 localStorage 정리
    useEffect(() => {
        return () => {
            clearGeometry(id);
        };
    }, [id]);

    const onClickMax = useCallback(() => {
        if (!boxRef.current) return;
        setIsMaxSize(true);
        const box = boxRef.current;
        const w = window.innerWidth;
        const h = window.innerHeight - TASKBAR_HEIGHT;
        box.style.transition = "0.25s";
        box.style.transform = "translate3d(0, 0, 0)";
        box.style.width = `${w}px`;
        box.style.height = `${h}px`;
        // 최대화 시에는 localStorage 를 덮어쓰지 않는다.
        // 복원 시 마지막에 저장된 (드래그/리사이즈) 위치로 돌아가도록 두기 위함.
    }, [boxRef]);

    const onClickNormalSize = useCallback(() => {
        if (!boxRef.current) return;
        setIsMaxSize(false);
        const box = boxRef.current;
        const prev = loadGeometry(id);
        const next: Geometry = {
            x: prev?.x ?? Math.max(0, Math.floor(window.innerWidth / 2 - DEFAULT_W / 2)),
            y: prev?.y ?? Math.max(0, Math.floor(window.innerHeight / 2 - DEFAULT_H / 2)),
            w: DEFAULT_W,
            h: DEFAULT_H,
        };
        box.style.transition = "0.25s";
        box.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`;
        box.style.width = `${next.w}px`;
        box.style.height = `${next.h}px`;
        saveGeometry(id, next);
    }, [boxRef, id]);

    const triggerClose = useCallback(
        (onFinish: () => void) => {
            if (!boxRef.current) {
                onFinish();
                return;
            }
            setIsClose(true);
            const box = boxRef.current;
            // 현재 위치를 유지한 채 transform 에 scale 0.9 통합 — 박스 visual center 기준으로 작아짐
            const stored = loadGeometry(id);
            const x = stored?.x ?? 0;
            const y = stored?.y ?? 0;
            box.style.transition = "0.25s";
            box.style.opacity = "0";
            box.style.transform = `translate3d(${x}px, ${y}px, 0) scale(0.9)`;
            setTimeout(onFinish, 300);
        },
        [boxRef, id]
    );

    return {
        isMaxSize,
        isClose,
        onClickMax,
        onClickNormalSize,
        triggerClose,
    };
}

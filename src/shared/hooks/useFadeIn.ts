import { useEffect, useState } from "react";

/**
 * 마운트 직후 다음 애니메이션 프레임에서 isMounted를 true로 전환하여
 * opacity 기반 페이드인을 트리거하는 훅.
 *
 * @returns isMounted — 페이드인 시작 여부
 */
export default function useFadeIn(): boolean {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setIsMounted(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    return isMounted;
}

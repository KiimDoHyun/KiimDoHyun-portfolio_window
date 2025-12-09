import { FullScreenBox, Icon } from "@fsd/window/6_common/components";
import { css } from "@styled-system/css";
import { flex } from "@styled-system/patterns";
import { useDragUp } from "@fsd/window/6_common/hooks";
import { useRef, useState, useEffect } from "react";

export default function Login({ wallpaper }: { wallpaper: string }) {
  const hour = 9;
  const minute = 14;
  const month = 9;
  const day = 13;

  const screenBoxRef = useRef<HTMLDivElement>(null);
  const [translateY, setTranslateY] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);
  const isDragEndedRef = useRef(false);

  useEffect(() => {
    const updateScreenHeight = () => {
      setScreenHeight(window.innerHeight);
    };
    updateScreenHeight();
    window.addEventListener("resize", updateScreenHeight);
    return () => window.removeEventListener("resize", updateScreenHeight);
  }, []);

  const handleDragEnd = (dragDistance: number) => {
    isDragEndedRef.current = true;

    if (dragDistance >= screenHeight / 2) {
      setTranslateY(-screenHeight);
    } else {
      setTranslateY(0);
    }
  };

  const handleDragUp = (dragDistance: number) => {
    if (isDragEndedRef.current) {
      return;
    }

    const newTranslateY = -dragDistance;
    setTranslateY(Math.max(newTranslateY, -screenHeight));
  };

  const handleClick = () => {
    console.log("onClickLogin");
  };

  const dragHandlers = useDragUp({
    throttleTime: 10,
    onDragUp: handleDragUp,
    onDragEnd: handleDragEnd,
    onClick: handleClick,
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragEndedRef.current = false; // 드래그 시작 시 플래그 리셋
    dragHandlers.onMouseDown(e);
  };

  return (
    <FullScreenBox>
      <div
        className={css({
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        })}
      >
        <img
          src={wallpaper}
          alt="wallpaper"
          className={css({ width: "100%", height: "100%" })}
        />
      </div>
      <div
        className={flex({
          direction: "column",
          width: "100%",
          height: "100%",
        })}
        ref={screenBoxRef}
        style={{
          transform: `translateY(${translateY}px)`,
          transition:
            translateY === 0 || translateY === -screenHeight
              ? "transform 0.3s ease-out"
              : "none",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={dragHandlers.onMouseMove}
        onMouseUp={dragHandlers.onMouseUp}
        onMouseLeave={dragHandlers.onMouseLeave}
      >
        <div
          className={flex({
            flex: 1,
            alignItems: "flex-end",
          })}
        >
          <div
            className={flex({
              direction: "column",
              width: "100%",
              height: "100%",
              alignItems: "flex-start",
              justifyContent: "flex-end",
              padding: 8,
            })}
          >
            <div className={css({ fontSize: "5rem" })}>
              {hour}:{minute}
            </div>
            <div className={css({ fontSize: "2rem" })}>
              {month}월 {day}일 일요일
            </div>
          </div>
        </div>
        <div
          className={flex({ justifyContent: "flex-end", padding: 4, gap: 2 })}
        >
          <Icon />
          <Icon />
        </div>
      </div>
    </FullScreenBox>
  );
}

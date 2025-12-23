import { Icon } from "@fsd/window/6_common/components";
import { css } from "@styled-system/css";
import { flex } from "@styled-system/patterns";
import { useDragUp, useScreenHeight } from "@fsd/window/6_common/hooks";
import { useRef, useState } from "react";
import LoginInput from "./components/LoginInput/LoginInput";
import { LoginBox, TRANSLATE_Y_CSS_VAR } from "./Login.style";

interface Props {
  onDragUpToEnd: VoidFunction;
}

const ANIMATION_DURATION = 0.2;

export default function Login({ onDragUpToEnd }: Props) {
  const hour = 9;
  const minute = 14;
  const month = 9;
  const day = 13;

  const screenBoxRef = useRef<HTMLDivElement>(null);
  const [translateY, setTranslateY] = useState(0);
  const screenHeight = useScreenHeight();
  const [displayLogin, setDisplayLogin] = useState(false);

  const isDragEndedRef = useRef(false);

  const dragUpToEnd = () => {
    setTranslateY(-screenHeight);

    console.log("111");
    setTimeout(() => {
      setDisplayLogin(true);

      onDragUpToEnd();
    }, ANIMATION_DURATION * 1000);
  };

  const handleDragEnd = (dragDistance: number) => {
    isDragEndedRef.current = true;

    if (dragDistance >= screenHeight / 2) {
      dragUpToEnd();
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

  const dragHandlers = useDragUp({
    throttleTime: 10,
    onDragUp: handleDragUp,
    onDragEnd: handleDragEnd,
    onClick: dragUpToEnd,
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragEndedRef.current = false;
    dragHandlers.onMouseDown(e);
  };

  if (displayLogin) {
    return <LoginInput userName="John Doe" />;
  }

  return (
    <LoginBox
      ref={screenBoxRef}
      style={
        {
          [TRANSLATE_Y_CSS_VAR]: `${translateY}px`,
        } as React.CSSProperties
      }
      animated={translateY === 0 || translateY === -screenHeight}
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
      <div className={flex({ justifyContent: "flex-end", padding: 4, gap: 2 })}>
        <Icon />
        <Icon />
      </div>
    </LoginBox>
  );
}

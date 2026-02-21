import { css } from "@styled-system/css";
import { flex } from "@styled-system/patterns";
import {
  DRAG_DIRECTION,
  OnDrag,
  OnDragEnd,
  useDrag,
  useScreenHeight,
} from "@fsd/window/6_common/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import LoginInput from "./components/LoginInput/LoginInput";
import { LoginBox, TRANSLATE_Y_CSS_VAR } from "./Login.style";

interface Props {
  isUnlocked: boolean;
  onUnlock: VoidFunction;
}

const ANIMATION_DURATION = 0.2;

export default function Login({ isUnlocked, onUnlock }: Props) {
  const hour = 9;
  const minute = 14;
  const month = 9;
  const day = 13;

  const screenBoxRef = useRef<HTMLDivElement>(null);
  const [translateY, setTranslateY] = useState(0);
  const screenHeight = useScreenHeight();

  useEffect(() => {
    if (!isUnlocked) {
      setTranslateY(0);
    }
  }, [isUnlocked]);

  const dragUpToEnd = useCallback(() => {
    setTranslateY(-screenHeight);

    setTimeout(() => {
      onUnlock();
    }, ANIMATION_DURATION * 1000);
  }, [screenHeight, onUnlock]);

  const handleDrag = useCallback<OnDrag>((params) => {
    if (params.dragDirection[DRAG_DIRECTION.UP]) {
      setTranslateY(-params.dragDistance);
    }
  }, []);

  const handleDragEnd = useCallback<OnDragEnd>(
    (params) => {
      if (
        params.dragDistance === 0 ||
        params.dragDistance >= screenHeight / 2
      ) {
        dragUpToEnd();
      } else {
        setTranslateY(0);
      }
    },
    [dragUpToEnd, screenHeight]
  );

  const dragHandlers = useDrag({
    onDrag: handleDrag,
    onDragEnd: handleDragEnd,
  });

  if (isUnlocked) {
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
      onMouseDown={dragHandlers.onMouseDown}
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
    </LoginBox>
  );
}

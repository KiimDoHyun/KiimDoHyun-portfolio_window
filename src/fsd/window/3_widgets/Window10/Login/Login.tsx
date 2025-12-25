import { Icon } from "@fsd/window/6_common/components";
import { css } from "@styled-system/css";
import { flex } from "@styled-system/patterns";
import {
  DRAG_DIRECTION,
  OnDrag,
  OnDragEnd,
  useDrag,
  useScreenHeight,
} from "@fsd/window/6_common/hooks";
import { useCallback, useRef, useState } from "react";
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

  const dragUpToEnd = useCallback(() => {
    setTranslateY(-screenHeight);

    setTimeout(() => {
      setDisplayLogin(true);

      onDragUpToEnd();
    }, ANIMATION_DURATION * 1000);
  }, [screenHeight, onDragUpToEnd]);

  const handleMouseLeave = () => {
    isDragEndedRef.current = false;
  };

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
    onMouseLeave: handleMouseLeave,
  });

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
      onMouseDown={dragHandlers.onMouseDown}
      onMouseMove={dragHandlers.onMouseMove}
      onMouseUp={dragHandlers.onMouseUp}
      onMouseLeave={dragHandlers.onMouseLeave}
      onClick={() => {
        console.log("click");
      }}
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

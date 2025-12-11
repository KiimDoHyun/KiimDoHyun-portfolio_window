import { css } from "@styled-system/css";
import { useEffect, useRef, useState } from "react";
import { LoginInputBox } from "./LoginInput.style";

const ANIMATION_DURATION = 0.2;

interface Props {
  userIcon?: string;
  userName: string;
}

export default function LoginInput({ userIcon, userName }: Props) {
  const [visible, setVisible] = useState(false);
  const opacityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    opacityTimeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, ANIMATION_DURATION * 1000);

    return () => {
      if (opacityTimeoutRef.current) {
        clearTimeout(opacityTimeoutRef.current);
      }
    };
  }, []);

  return (
    <LoginInputBox visible={visible}>
      <div
        className={css({
          width: "100px",
          height: "100px",
          backgroundColor: "gray",
          borderRadius: "10px",
        })}
      />
      <h1>{userName}</h1>
      <button>로그인</button>
    </LoginInputBox>
  );
}

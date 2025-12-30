import { useEffect, useRef, useState } from "react";
import { LoginInputBox, UserIconBox, LoginButton } from "./LoginInput.style";

import defaultUserIcon from "@images/icons/user.png";
import { css } from "@styled-system/css";

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
      <UserIconBox>
        <img src={defaultUserIcon} alt="user icon" />
      </UserIconBox>
      <h1 className={css({ color: "white" })}>{userName}</h1>
      <LoginButton>로그인</LoginButton>
    </LoginInputBox>
  );
}

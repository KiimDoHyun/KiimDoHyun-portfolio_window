import { ReactNode, useEffect } from "react";
import { ThemeId } from "./themeTypes";

type ThemeProviderProps = {
  themeId: ThemeId;
  children: ReactNode;
};

/**
 * `<html data-theme="...">` 속성을 토글하는 것이 전부인 Provider.
 * 사용처는 테마를 전혀 몰라야 하므로 context 는 제공하지 않는다 —
 * themeId 를 알아야 하는 것은 토글 UI 뿐이며, 그 쪽은 자체 state 를 들고 있다.
 */
export const ThemeProvider = ({ themeId, children }: ThemeProviderProps) => {
  useEffect(() => {
    if (themeId === "base") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", themeId);
    }
  }, [themeId]);

  return <>{children}</>;
};

import { FullScreenBox, Icon } from "@fsd/window/6_common/components";
import { css } from "@styled-system/css";
import { flex } from "@styled-system/patterns";

export default function Login() {
  const hour = 9;
  const minute = 14;
  const month = 9;
  const day = 13;
  return (
    <FullScreenBox>
      <div
        className={flex({ direction: "column", width: "100%", height: "100%" })}
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

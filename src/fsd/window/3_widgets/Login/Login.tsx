import FullScreenBox from "@fsd/window/6_common/ui/FullScreenBox";
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
        <div className={css({ flex: 1 })}>
          <div>
            {hour}: {minute}
          </div>
          <div>
            {month}월 {day}일 일요일
          </div>
        </div>
        <div>
          <Icon />
          <Icon />
        </div>
      </div>
    </FullScreenBox>
  );
}

const Icon = () => {
  return (
    <div
      className={css({
        width: "20px",
        height: "20px",
        backgroundColor: "gray",
      })}
    />
  );
};

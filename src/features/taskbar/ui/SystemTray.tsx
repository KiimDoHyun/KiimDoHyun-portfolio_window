import message from "@images/icons/message.png";
import arrowUp from "@images/icons/collapse-arrow-up-white.png";
import arrowDown from "@images/icons/collapse-arrow-down-white.png";
import {
    SystemTrayRoot,
    ArrowUpCell,
    DateInfoCell,
    InfoCell,
    CloseAllCell,
} from "./SystemTray.style";

interface SystemTrayProps {
    hiddenIcon: boolean;
    cur_year: number | string;
    cur_month: number | string;
    cur_date: number | string;
    cur_hour: number | string;
    cur_minute: number | string;
    cur_timeline: string;
    onClickHiddenIcon: () => void;
    onClickTime: () => void;
    onClickInfo: () => void;
    onClickCloseAll: () => void;
}

const SystemTray = ({
    hiddenIcon,
    cur_year,
    cur_month,
    cur_date,
    cur_hour,
    cur_minute,
    cur_timeline,
    onClickHiddenIcon,
    onClickTime,
    onClickInfo,
    onClickCloseAll,
}: SystemTrayProps) => {
    return (
        <SystemTrayRoot>
            <ArrowUpCell
                title={
                    hiddenIcon
                        ? "숨기기"
                        : "포트폴리오 제작에 사용된 기술\n숨겨진 아이콘 표시"
                }
                onClick={onClickHiddenIcon}
            >
                {hiddenIcon ? (
                    <img src={arrowDown} alt="arrowDown" />
                ) : (
                    <img src={arrowUp} alt="arrowUp" />
                )}
            </ArrowUpCell>

            <DateInfoCell onClick={onClickTime} data-testid="taskbar-date">
                <div>
                    {cur_timeline} {cur_hour}:{cur_minute}
                </div>
                <div>
                    {cur_year}-{cur_month}-{`0${cur_date}`.slice(-2)}
                </div>
            </DateInfoCell>

            <InfoCell
                onClick={onClickInfo}
                title="새 알림 없음"
                data-testid="taskbar-info"
            >
                <img src={message} alt="message" />
            </InfoCell>

            <CloseAllCell
                onClick={onClickCloseAll}
                data-testid="taskbar-close-all"
            />
        </SystemTrayRoot>
    );
};

export default SystemTray;

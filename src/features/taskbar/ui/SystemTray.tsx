import message from "@images/icons/message.png";
import arrowUp from "@images/icons/collapse-arrow-up-white.png";
import arrowDown from "@images/icons/collapse-arrow-down-white.png";

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
        <div className="box3">
            <div
                className="arrowUpIcon taskHoverEffect"
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
            </div>

            <div className="dateInfo taskHoverEffect" onClick={onClickTime}>
                <div className="time">
                    {cur_timeline} {cur_hour}:{cur_minute}
                </div>
                <div className="date">
                    {cur_year}-{cur_month}-{`0${cur_date}`.slice(-2)}
                </div>
            </div>

            <div
                className="info taskHoverEffect"
                onClick={onClickInfo}
                title="새 알림 없음"
            >
                <img src={message} alt="message" />
            </div>

            <div
                className="closeAllButton taskHoverEffect"
                onClick={onClickCloseAll}
            />
        </div>
    );
};

export default SystemTray;

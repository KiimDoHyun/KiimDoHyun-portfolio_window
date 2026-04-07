import close from "@images/icons/close.png";
import horizontalLine from "@images/icons/horizontal-line.png";
import maximize from "@images/icons/maximize.png";
import minimize from "@images/icons/minimize.png";

interface WindowHeaderProps {
  title: string;
  iconSrc: string;
  isMaxSize: boolean;
  onDragMouseDown: (e: React.MouseEvent) => void;
  onDragMouseUp: () => void;
  onClickMin: () => void;
  onClickMax: () => void;
  onClickNormalSize: () => void;
  onClickClose: () => void;
}

const WindowHeader = ({
  title,
  iconSrc,
  isMaxSize,
  onDragMouseDown,
  onDragMouseUp,
  onClickMin,
  onClickMax,
  onClickNormalSize,
  onClickClose,
}: WindowHeaderProps) => {
  return (
    <div className="headerArea">
      <div
        className="infoArea"
        onMouseDown={onDragMouseDown}
        onMouseUp={onDragMouseUp}
      >
        <img src={iconSrc} alt={title} />
        <div className="programTitle">{title}</div>
      </div>
      <div
        className="dragArea"
        onMouseDown={onDragMouseDown}
        onMouseUp={onDragMouseUp}
      />
      <div className="buttonArea">
        <div className="buttonIcon" onClick={onClickMin}>
          <img src={horizontalLine} alt="minimize" />
        </div>
        {isMaxSize ? (
          <div className="buttonIcon" onClick={onClickNormalSize}>
            <img src={minimize} alt="normal size" />
          </div>
        ) : (
          <div className="buttonIcon" onClick={onClickMax}>
            <img src={maximize} alt="maximize" />
          </div>
        )}
        <div className="buttonIcon close" onClick={onClickClose}>
          <img src={close} alt="close" />
        </div>
      </div>
    </div>
  );
};

export default WindowHeader;

import leftArrow from "@images/icons/left-arrow.png";
import { headerStyle } from "../FolderProgram.style";
import type { DisplayOption } from "../FolderProgram.types";

interface FolderHeaderProps {
    type: string;
    route: string;
    displayType: string;
    displayList: Array<DisplayOption>;
    onClickLeft: () => void;
    onChangeDisplayType: (value: string) => void;
}

const FolderHeader = ({
    type,
    route,
    displayType,
    displayList,
    onClickLeft,
    onChangeDisplayType,
}: FolderHeaderProps) => (
    <div className={`headerArea2 headerArea2_${type} ${headerStyle}`}>
        <div className="arrowBox">
            <img src={leftArrow} alt="leftArrow" onClick={onClickLeft} />
        </div>
        <div className="routeBox">
            <input value={route} readOnly />
        </div>
        <div className="selectDisplayType">
            <select
                value={displayType}
                onChange={(e) => onChangeDisplayType(e.target.value)}
            >
                {displayList.map((item, idx) => (
                    <option key={idx} value={item.value}>
                        {item.name}
                    </option>
                ))}
            </select>
        </div>
    </div>
);

export default FolderHeader;

import { forwardRef, type CSSProperties } from "react";
import type { ProgramId } from "@shared/types/program";
import type { TaskbarEntry } from "../TaskBar.types";
import { resolveProgramIcon } from "@shared/lib";
import {
    ProgramIconsRoot,
    ShortCutIcon,
    ShortCutImg,
    ShortCutBottomLine,
    ShotCutHover,
    ButtonCover,
    BodyCover,
} from "./ProgramIcons.style";

interface ProgramIconsProps {
    entries: Array<TaskbarEntry>;
    activeId: ProgramId | null;
    /** hover 중인 아이콘의 인덱스. hover 없음은 `null`. */
    hoverIdx: number | null;
    hoverStyle: CSSProperties;
    onMouseEnter: (entry: TaskbarEntry, idx: number) => void;
    onMouseLeave: (idx: number) => void;
    onClickIcon: (entry: TaskbarEntry, idx: number) => void;
    onClickClose: () => void;
}

const renderIconImage = (entry: TaskbarEntry) => {
    const icon = resolveProgramIcon(entry.node);
    return <img src={icon} alt={entry.node.name} />;
};

const ProgramIcons = forwardRef<HTMLDivElement, ProgramIconsProps>(
    (
        {
            entries,
            activeId,
            hoverIdx,
            hoverStyle,
            onMouseEnter,
            onMouseLeave,
            onClickIcon,
            onClickClose,
        },
        ref
    ) => {
        return (
            <ProgramIconsRoot ref={ref}>
                {entries.map((entry, idx) => {
                    const isActive = activeId === entry.node.id;
                    const isHover = hoverIdx === idx;
                    const emphasized = isActive || isHover;
                    return (
                        <ShortCutIcon
                            key={entry.node.id}
                            active={isActive}
                            data-active={isActive ? "true" : undefined}
                            data-testid={`taskbar-icon-${entry.node.id}`}
                            title={entry.node.name}
                            onMouseEnter={() => onMouseEnter(entry, idx)}
                            onMouseLeave={() => onMouseLeave(idx)}
                        >
                            <ShortCutImg
                                onClick={() => onClickIcon(entry, idx)}
                            >
                                {renderIconImage(entry)}
                            </ShortCutImg>
                            <ShortCutBottomLine emphasized={emphasized} />
                            <ShotCutHover
                                hovering={isHover}
                                // hover 중이 아닌 아이콘에도 동일한 top/left/pointerEvents 를 적용한다.
                                // height:0 상태라도 BodyCover/ButtonCover 의 좌표가 잘못되면
                                // 보이지 않는 커버가 start 버튼 / 타 아이콘 영역을 가려 클릭을 막는다.
                                // (commit 1fee1a4 회귀 재발 방지)
                                style={hoverStyle}
                            >
                                <ButtonCover
                                    data-testid={`taskbar-close-${entry.node.id}`}
                                    onClick={onClickClose}
                                />
                                <BodyCover
                                    onClick={() => onClickIcon(entry, idx)}
                                />
                            </ShotCutHover>
                        </ShortCutIcon>
                    );
                })}
            </ProgramIconsRoot>
        );
    }
);

ProgramIcons.displayName = "ProgramIcons";

export default ProgramIcons;

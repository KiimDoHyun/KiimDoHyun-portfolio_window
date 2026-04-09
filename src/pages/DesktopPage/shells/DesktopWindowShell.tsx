import { useMemo } from "react";
import { useFileSystemStore } from "@store/fileSystemStore";
import { useRunningProgramsStore } from "@store/runningProgramsStore";
import { DesktopWindow } from "@features/desktop";
import { selectDesktopRootIcons } from "@shared/lib/file-system/selectors/selectDesktopRootIcons";
import type { ProgramNode } from "@shared/types/program";

const DesktopWindowShell = () => {
    const rootId = useFileSystemStore((s) => s.rootId);
    const nodes = useFileSystemStore((s) => s.nodes);
    const childrenByParent = useFileSystemStore((s) => s.childrenByParent);
    const openProgram = useRunningProgramsStore((s) => s.open);

    const iconBoxArr = useMemo(
        () => selectDesktopRootIcons({ rootId, nodes, childrenByParent }),
        [rootId, nodes, childrenByParent],
    );

    const handleDoubleClickIcon = (item: ProgramNode) => openProgram(item.id);

    return (
        <DesktopWindow
            iconBoxArr={iconBoxArr}
            onDoubleClickIcon={handleDoubleClickIcon}
        />
    );
};

export default DesktopWindowShell;

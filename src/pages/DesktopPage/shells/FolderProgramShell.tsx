import { useFileSystemStore } from "@store/fileSystemStore";
import { useRunningProgramsStore } from "@store/runningProgramsStore";
import { FolderProgram } from "@features/program-folder";
import type { ProgramId } from "@shared/types/program";

interface FolderProgramShellProps {
    id: ProgramId;
}

const FolderProgramShell = ({ id }: FolderProgramShellProps) => {
    const rootId = useFileSystemStore((s) => s.rootId);
    const nodes = useFileSystemStore((s) => s.nodes);
    const childrenByParent = useFileSystemStore((s) => s.childrenByParent);
    const openProgram = useRunningProgramsStore((s) => s.open);

    return (
        <FolderProgram
            fsState={{ rootId, nodes, childrenByParent }}
            initialFolderId={id}
            onOpenProgram={openProgram}
        />
    );
};

export default FolderProgramShell;

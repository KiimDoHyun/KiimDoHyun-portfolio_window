import { WindowShell } from "@features/window-shell";
import type {
    ProgramId,
    ProgramNode,
    RunningProgram,
} from "@shared/types/program";
import { renderProgramContent } from "./renderProgramContent";
import { resolveProgramTitle, resolveProgramIcon } from "./resolveProgramMeta";

interface ProgramWindowProps {
    node: ProgramNode;
    running: RunningProgram;
    activeId: ProgramId | null;
    onActivate: (id: ProgramId) => void;
    onMinimize: (id: ProgramId) => void;
    onClose: (id: ProgramId) => void;
    onRequestZIndex: () => number;
}

const ProgramWindow = ({
    node,
    running,
    activeId,
    onActivate,
    onMinimize,
    onClose,
    onRequestZIndex,
}: ProgramWindowProps) => {
    const subHeader =
        node.type === "BROWSER" ? (
            <div className={`headerArea2 headerArea2_${node.type}`} />
        ) : undefined;

    return (
        <WindowShell
            node={node}
            running={running}
            title={resolveProgramTitle(node)}
            iconSrc={resolveProgramIcon(node)}
            activeId={activeId}
            subHeader={subHeader}
            onActivate={onActivate}
            onMinimize={onMinimize}
            onClose={onClose}
            onRequestZIndex={onRequestZIndex}
        >
            {renderProgramContent(node)}
        </WindowShell>
    );
};

export default ProgramWindow;

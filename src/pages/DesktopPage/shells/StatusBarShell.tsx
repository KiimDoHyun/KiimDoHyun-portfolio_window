import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useFileSystemStore } from "@store/fileSystemStore";
import { useRunningProgramsStore } from "@store/runningProgramsStore";
import { useUiStore } from "@store/uiStore";
import { selectStatusBarViewModel } from "@shared/lib/file-system/selectors/selectStatusBarViewModel";
import StatusBar from "@features/statusbar/StatusBar";
import type { ProgramId } from "@shared/types/program";

const StatusBarShell = () => {
    const navigate = useNavigate();
    const rootId = useFileSystemStore((s) => s.rootId);
    const nodes = useFileSystemStore((s) => s.nodes);
    const childrenByParent = useFileSystemStore((s) => s.childrenByParent);
    const statusBarOpen = useUiStore((s) => s.statusBarOpen);

    const openProgram = useRunningProgramsStore((s) => s.open);

    const viewModel = useMemo(
        () => selectStatusBarViewModel({ rootId, nodes, childrenByParent }),
        [rootId, nodes, childrenByParent],
    );

    const handleOpenProgram = useCallback(
        (id: ProgramId) => openProgram(id),
        [openProgram],
    );

    const handleClose = useCallback(() => {
        useUiStore.setState({ statusBarOpen: false });
    }, []);

    const handleLogout = useCallback(() => {
        useRunningProgramsStore.getState().reset();
        useUiStore.getState().closeAllMenus();
        navigate("/window/login", { replace: true });
    }, [navigate]);

    return (
        <StatusBar
            active={statusBarOpen}
            viewModel={viewModel}
            onOpenProgram={handleOpenProgram}
            onClose={handleClose}
            onLogout={handleLogout}
        />
    );
};

export default StatusBarShell;

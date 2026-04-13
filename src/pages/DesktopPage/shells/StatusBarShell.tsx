import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFileSystemStore } from "@store/fileSystemStore";
import { useRunningProgramsStore } from "@store/runningProgramsStore";
import { useUiStore } from "@store/uiStore";
import { selectStatusBarViewModel } from "@shared/lib/file-system/selectors/selectStatusBarViewModel";
import StatusBar from "@features/statusbar/StatusBar";
import LogoutOverlay from "../components/LogoutOverlay";
import type { ProgramId } from "@shared/types/program";

export const LOGOUT_DELAY_MS = 1000;
export const LOGOUT_FADE_DURATION_MS = 400;

const StatusBarShell = () => {
    const navigate = useNavigate();
    const rootId = useFileSystemStore((s) => s.rootId);
    const nodes = useFileSystemStore((s) => s.nodes);
    const childrenByParent = useFileSystemStore((s) => s.childrenByParent);
    const statusBarOpen = useUiStore((s) => s.statusBarOpen);

    const openProgram = useRunningProgramsStore((s) => s.open);

    const [isLoggingOut, setIsLoggingOut] = useState(false);

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
        setIsLoggingOut(true);
        useUiStore.getState().closeAllMenus();

        setTimeout(() => {
            useRunningProgramsStore.getState().reset();
            navigate("/window/login", { replace: true });
        }, LOGOUT_DELAY_MS);
    }, [navigate]);

    return (
        <>
            <StatusBar
                active={statusBarOpen}
                viewModel={viewModel}
                onOpenProgram={handleOpenProgram}
                onClose={handleClose}
                onLogout={handleLogout}
            />
            <LogoutOverlay visible={isLoggingOut} />
        </>
    );
};

export default StatusBarShell;

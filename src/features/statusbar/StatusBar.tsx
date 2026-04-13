import { useCallback, useState, useRef } from "react";
import StatusBarView from "./components/StatusBar";
import imgReact from "@images/icons/react.png";
import imgJS from "@images/icons/javascript.png";
import imgKit from "@images/icons/logo_kit.jpg";
import imgOne from "@images/icons/number_one.png";
import imgUser from "@images/icons/user.png";
import imgWhaTap from "@images/icons/WhaTap_vertical_logo.png";
import type { StatusBarViewModel } from "@shared/lib/file-system/selectors/selectStatusBarViewModel";
import type { ProgramId } from "@shared/types/program";

interface StatusBarProps {
    active: boolean;
    viewModel: StatusBarViewModel;
    onOpenProgram: (id: ProgramId) => void;
    onClose: () => void;
    onLogout: () => void;
}

const STATUSBAR_LEFT_AREA_ITEMS = [
    { img: imgUser, text: "Front-End 김도현" },
    { img: imgReact, text: "리액트" },
    { img: imgJS, text: "자바스크립트" },
    { img: imgWhaTap, text: "와탭랩스 재직중" },
    { img: imgOne, text: "경력 1년차 주니어" },
    { img: imgKit, text: "금오공과대학교 졸업" },
];

const StatusBar = ({ active, viewModel, onOpenProgram, onClose, onLogout }: StatusBarProps) => {
    const [activeLeftArea_Detail, setActiveLeftArea_Detail] = useState(false);
    const activeLeftArea_timer = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );

    const onMouseEnter = useCallback(() => {
        activeLeftArea_timer.current = setTimeout(
            () => setActiveLeftArea_Detail(true),
            500,
        );
    }, []);

    const onMouseLeave = useCallback(() => {
        if (activeLeftArea_timer.current) {
            clearTimeout(activeLeftArea_timer.current);
        }
        setActiveLeftArea_Detail(false);
    }, []);

    const handleClickBox = useCallback(
        (id: ProgramId) => {
            onOpenProgram(id);
            onClose();
        },
        [onOpenProgram, onClose],
    );

    const handleClickLeftArea = useCallback(() => {
        if (viewModel.myComputerId) {
            onOpenProgram(viewModel.myComputerId);
            onClose();
        }
    }, [viewModel.myComputerId, onOpenProgram, onClose]);

    return (
        <StatusBarView
            active={active}
            activeLeftArea_Detail={activeLeftArea_Detail}
            statusBar_LeftArea_Items={STATUSBAR_LEFT_AREA_ITEMS}
            projectDatas={viewModel.projects}
            techStack_main={viewModel.techStackMain}
            techStack_sub={viewModel.techStackSub}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClickBox={handleClickBox}
            onClickLeftArea={handleClickLeftArea}
            onLogout={onLogout}
        />
    );
};

export default StatusBar;

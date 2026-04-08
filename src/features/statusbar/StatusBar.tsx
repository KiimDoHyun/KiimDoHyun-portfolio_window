import { useCallback, useMemo, useState, useRef } from "react";
import StatusBarView from "./components/StatusBar";
import imgReact from "@images/icons/react.png";
import imgJS from "@images/icons/javascript.png";
import imgKit from "@images/icons/logo_kit.jpg";
import imgOne from "@images/icons/number_one.png";
import imgUser from "@images/icons/user.png";
import imgWhaTap from "@images/icons/WhaTap_vertical_logo.png";
import { useFileSystemStore } from "@store/fileSystemStore";
import { useRunningProgramsStore } from "@store/runningProgramsStore";
import type { ProgramNode } from "@shared/types/program";

interface StatusBarProps {
    active: boolean;
    onClose: () => void;
}

interface ViewItem {
    name: string;
    icon: string;
    parent: string;
    type: string;
}

function nodeIcon(node: ProgramNode): string {
    return (node as unknown as { icon?: string }).icon ?? "";
}

const StatusBar = ({ active, onClose }: StatusBarProps) => {
    const nodes = useFileSystemStore((s) => s.nodes);
    const childrenByParent = useFileSystemStore((s) => s.childrenByParent);

    const findIdByName = useCallback(
        (name: string) => {
            for (const id of Object.keys(nodes)) {
                if (nodes[id].name === name) return id;
            }
            return null;
        },
        [nodes]
    );

    const childrenOf = useCallback(
        (parentName: string): Array<ViewItem> => {
            const parentId = findIdByName(parentName);
            if (!parentId) return [];
            return (childrenByParent[parentId] ?? [])
                .map((cid) => nodes[cid])
                .filter((n): n is ProgramNode => !!n)
                .map((n) => ({
                    name: n.name,
                    icon: nodeIcon(n),
                    parent: parentName,
                    type: n.type,
                }));
        },
        [findIdByName, childrenByParent, nodes]
    );

    const projectDatas = useMemo<Array<ViewItem>>(() => {
        return [
            ...childrenOf("금오공과대학교 셈틀꾼"),
            ...childrenOf("금오공과대학교 컴퓨터공학과 학생회"),
            ...childrenOf("(주)아라온소프트"),
        ];
    }, [childrenOf]);

    const techStack_main = useMemo(() => childrenOf("MAIN_TECH"), [childrenOf]);
    const techStack_sub = useMemo(() => childrenOf("SUB_TECH"), [childrenOf]);

    const [activeLeftArea_Detail, setActiveLeftArea_Detail] = useState(false);
    const activeLeftArea_timer = useRef<ReturnType<typeof setTimeout> | null>(
        null
    );
    const [statusBar_LeftArea_Items] = useState([
        { img: imgUser, text: "Front-End 김도현" },
        { img: imgReact, text: "리액트" },
        { img: imgJS, text: "자바스크립트" },
        { img: imgWhaTap, text: "와탭랩스 재직중" },
        { img: imgOne, text: "경력 1년차 주니어" },
        { img: imgKit, text: "금오공과대학교 졸업" },
    ]);

    const onMouseEnter = useCallback(() => {
        activeLeftArea_timer.current = setTimeout(
            () => setActiveLeftArea_Detail(true),
            500
        );
    }, []);

    const onMouseLeave = useCallback(() => {
        if (activeLeftArea_timer.current) {
            clearTimeout(activeLeftArea_timer.current);
        }
        setActiveLeftArea_Detail(false);
    }, []);

    const onClickBox = useCallback(
        (parentName: string) => {
            const id = findIdByName(parentName);
            if (!id) return;
            useRunningProgramsStore.getState().open(id);
            onClose();
        },
        [findIdByName, onClose]
    );

    return (
        <StatusBarView
            active={active}
            activeLeftArea_Detail={activeLeftArea_Detail}
            statusBar_LeftArea_Items={statusBar_LeftArea_Items}
            projectDatas={projectDatas}
            techStack_main={techStack_main}
            techStack_sub={techStack_sub}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClickBox={onClickBox}
        />
    );
};

export default StatusBar;

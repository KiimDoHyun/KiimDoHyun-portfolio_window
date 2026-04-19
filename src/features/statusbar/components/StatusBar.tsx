import React, { Fragment, useMemo } from "react";

import imgMenu from "@images/icons/hamburger_menu.png";
import imgPower from "@images/icons/power.svg";
import LeftAreaBox from "./LeftAreaBox";
import CenterAreaBox from "./CenterAreaBox";
import RightAreaBox from "./RightAreaBox";
import { StatusBarBlock } from "./StatusBar.style";
import type { StatusBarTreeItem } from "@shared/lib/file-system/selectors/selectStatusBarViewModel";
import type { ProgramId } from "@shared/types/program";

type TechStackSection = {
    title: string;
    items: Array<StatusBarTreeItem>;
};

function groupTechStack(
    items: Array<StatusBarTreeItem>,
): Array<TechStackSection> {
    const sections: Array<TechStackSection> = [];
    for (const it of items) {
        if (it.type === "FOLDER") {
            sections.push({ title: it.name, items: [] });
        } else if (sections.length > 0) {
            sections[sections.length - 1].items.push(it);
        } else if (process.env.NODE_ENV !== "production") {
            console.warn(
                "[groupTechStack] FOLDER 없이 시작된 항목은 무시됨:",
                it,
            );
        }
    }
    return sections;
}

type StatusBarViewProps = {
    active: boolean;
    activeLeftArea_Detail: boolean;
    statusBar_LeftArea_Items: Array<{ img: string; text: string }>;
    projectDatas: Array<StatusBarTreeItem>;
    techStack: Array<StatusBarTreeItem>;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onClickBox: (id: ProgramId) => void;
    onClickLeftArea: () => void;
    onLogout: () => void;
};

const StatusBarView = ({
    active,
    activeLeftArea_Detail,
    statusBar_LeftArea_Items,
    projectDatas,
    techStack,
    onMouseEnter,
    onMouseLeave,
    onClickBox,
    onClickLeftArea,
    onLogout,
}: StatusBarViewProps) => {
    const techStackSections = useMemo(
        () => groupTechStack(techStack),
        [techStack],
    );

    return (
        <StatusBarBlock active={active}>
            {/* 소개 */}
            <div
                className="statusBarBoxArea leftArea"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {/* 마우스 호버에 따른 너비 변경을 위해 한단계 추가 */}
                <div
                    className={
                        activeLeftArea_Detail
                            ? "leftArea_Contents leftArea_Contents_Wide"
                            : "leftArea_Contents"
                    }
                >
                    <div className="leftArea_top">
                        <LeftAreaBox
                            img={imgMenu}
                            name={"소개"}
                            onClick={onClickLeftArea}
                        />
                    </div>
                    <div className="leftArea_contents">
                        {statusBar_LeftArea_Items.map((item, idx) => (
                            <LeftAreaBox
                                key={idx}
                                img={item.img}
                                name={item.text}
                                onClick={onClickLeftArea}
                            />
                        ))}
                    </div>
                    <div className="leftArea_bottom">
                        <LeftAreaBox
                            img={imgPower}
                            name={"로그아웃"}
                            onClick={onLogout}
                        />
                    </div>
                </div>
            </div>

            {/* 프로젝트 */}
            <div
                className={
                    active
                        ? "statusBarBoxArea centerArea show_animation"
                        : "statusBarBoxArea centerArea"
                }
            >
                {projectDatas.map((item) => (
                    <CenterAreaBox
                        key={item.id}
                        parentId={item.id}
                        img={item.icon}
                        name={item.name}
                        depth={item.depth}
                        onClick={onClickBox}
                    />
                ))}
            </div>

            {/* 기술 스택 */}
            <div
                className={
                    active
                        ? "statusBarBoxArea rightArea show_animation"
                        : "statusBarBoxArea rightArea"
                }
            >
                {techStackSections.map((section) => (
                    <Fragment key={section.title}>
                        <div className="rightArea_title">
                            <p>{section.title}</p>
                        </div>
                        <div className="rightArea_boxArea">
                            {section.items.map((item) => (
                                <RightAreaBox
                                    key={item.id}
                                    parentId={item.id}
                                    img={item.icon}
                                    name={item.name}
                                    onClick={onClickBox}
                                />
                            ))}
                        </div>
                    </Fragment>
                ))}
            </div>
        </StatusBarBlock>
    );
};

export default React.memo(StatusBarView);

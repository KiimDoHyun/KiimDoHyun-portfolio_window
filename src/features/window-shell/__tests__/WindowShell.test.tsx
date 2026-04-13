import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

vi.mock("../ProgramComponent.style", () => {
    return {
        ProgramComponent: React.forwardRef(
            (
                {
                    children,
                    isClose: _isClose,
                    ...rest
                }: { children?: React.ReactNode; isClose?: boolean } & Record<
                    string,
                    unknown
                >,
                ref: React.Ref<HTMLDivElement>
            ) =>
                React.createElement("div", { ref, ...rest }, children),
        ),
    };
});

import WindowShell from "../WindowShell";
import type { WindowShellProps } from "../WindowShell.types";
import type { ProgramNode, RunningProgram } from "@shared/types/program";

const node: ProgramNode = {
    id: "node-1",
    parentId: null,
    name: "내문서",
    icon: "icon.png",
    type: "FOLDER",
};

const running: RunningProgram = {
    id: "node-1",
    status: "active",
    zIndex: 1,
};

const buildProps = (
    overrides: Partial<WindowShellProps> = {}
): WindowShellProps => ({
    node,
    running,
    title: "내문서",
    iconSrc: "icon.png",
    activeId: "node-1",
    onActivate: vi.fn(),
    onMinimize: vi.fn(),
    onClose: vi.fn(),
    onRequestZIndex: vi.fn(() => 2),
    ...overrides,
});

describe("WindowShell (characterization)", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("title 과 iconSrc 를 헤더에 렌더한다", () => {
        render(<WindowShell {...buildProps()} />);
        expect(screen.getByText("내문서")).toBeInTheDocument();
        expect(screen.getByAltText("내문서")).toHaveAttribute("src", "icon.png");
    });

    it("창 영역 mouseDown 시 onActivate 가 node.id 로 호출된다", () => {
        const onActivate = vi.fn();
        render(<WindowShell {...buildProps({ onActivate })} />);
        fireEvent.mouseDown(screen.getByText("내문서").parentElement!);
        expect(onActivate).toHaveBeenCalledWith("node-1");
    });

    it("최소화 버튼 클릭 시 onMinimize 가 node.id 로 호출된다", () => {
        const onMinimize = vi.fn();
        render(<WindowShell {...buildProps({ onMinimize })} />);
        fireEvent.click(screen.getByAltText("minimize").parentElement!);
        expect(onMinimize).toHaveBeenCalledWith("node-1");
    });

    it("최대화 버튼 클릭 시 isMaxSize 가 true 로 변경되어 normal 버튼이 노출된다", () => {
        render(<WindowShell {...buildProps()} />);
        fireEvent.click(screen.getByAltText("maximize").parentElement!);
        expect(screen.getByAltText("normal size")).toBeInTheDocument();
    });

    it("닫기 버튼 클릭 시 애니메이션 종료 후 onClose 가 node.id 로 호출된다", () => {
        const onClose = vi.fn();
        render(<WindowShell {...buildProps({ onClose })} />);
        fireEvent.click(screen.getByAltText("close").parentElement!);
        expect(onClose).not.toHaveBeenCalled();
        act(() => {
            vi.advanceTimersByTime(300);
        });
        expect(onClose).toHaveBeenCalledWith("node-1");
    });

    it("activeId === node.id 일 때 onRequestZIndex 가 호출된다", () => {
        const onRequestZIndex = vi.fn(() => 7);
        render(<WindowShell {...buildProps({ onRequestZIndex })} />);
        expect(onRequestZIndex).toHaveBeenCalled();
    });
});

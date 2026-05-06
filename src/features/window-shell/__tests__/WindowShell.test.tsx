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
import { TASKBAR_HEIGHT, HEADER_HEIGHT } from "../lib/geometry";

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

describe("WindowShell drag clamping", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("드래그 mouseup 후 저장된 y 가 0 미만으로 내려가지 않는다", () => {
        render(<WindowShell {...buildProps()} />);
        const dragArea = document.querySelector(".dragArea") as HTMLElement;

        fireEvent.mouseDown(dragArea, { clientX: 500, clientY: 500 });
        fireEvent.mouseMove(document, { clientX: 500, clientY: -1000 });
        fireEvent.mouseUp(document);

        const stored = Number(localStorage.getItem("node-1y"));
        expect(stored).toBeGreaterThanOrEqual(0);
    });

    it("드래그 mouseup 후 y 가 (innerHeight - taskbar - headerHeight) 이하", () => {
        render(<WindowShell {...buildProps()} />);
        const dragArea = document.querySelector(".dragArea") as HTMLElement;

        fireEvent.mouseDown(dragArea, { clientX: 500, clientY: 500 });
        fireEvent.mouseMove(document, { clientX: 500, clientY: 9999 });
        fireEvent.mouseUp(document);

        const stored = Number(localStorage.getItem("node-1y"));
        expect(stored).toBeLessThanOrEqual(window.innerHeight - TASKBAR_HEIGHT - HEADER_HEIGHT);
    });
});

describe("WindowResizeHandles", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("8개 방향 핸들이 모두 렌더된다", () => {
        render(<WindowShell {...buildProps()} />);
        const directions = [
            "top",
            "right",
            "bottom",
            "left",
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
        ];
        for (const d of directions) {
            expect(
                document.querySelector(`.modiSize.${d.replace("-", "_")}`)
            ).toBeTruthy();
        }
    });
});

describe("WindowShell resize clamping", () => {
    beforeEach(() => {
        localStorage.clear();
        // 초기 geometry: 100,100 / 500x500. jsdom 기본 innerWidth=1024, innerHeight=768.
        localStorage.setItem("node-1x", "100");
        localStorage.setItem("node-1y", "100");
        localStorage.setItem("node-1w", "500");
        localStorage.setItem("node-1h", "500");
    });

    it("right 핸들로 끝까지 키워도 x + w 가 innerWidth 를 넘지 않는다", () => {
        render(<WindowShell {...buildProps()} />);
        const handle = document.querySelector(".modiSize.right") as HTMLElement;
        fireEvent.mouseDown(handle, { clientX: 600, clientY: 200 });
        fireEvent.mouseMove(document, { clientX: 99999, clientY: 200 });
        fireEvent.mouseUp(document);

        const x = Number(localStorage.getItem("node-1x"));
        const w = Number(localStorage.getItem("node-1w"));
        expect(x + w).toBeLessThanOrEqual(window.innerWidth);
    });

    it("left 핸들로 음수 방향까지 키워도 x 가 0 이상", () => {
        render(<WindowShell {...buildProps()} />);
        const handle = document.querySelector(".modiSize.left") as HTMLElement;
        fireEvent.mouseDown(handle, { clientX: 100, clientY: 200 });
        fireEvent.mouseMove(document, { clientX: -99999, clientY: 200 });
        fireEvent.mouseUp(document);

        const x = Number(localStorage.getItem("node-1x"));
        expect(x).toBeGreaterThanOrEqual(0);
    });
});

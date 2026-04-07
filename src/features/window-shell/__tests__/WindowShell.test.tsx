import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("../ProgramComponent.style", () => {
    const React = require("react");
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
                React.createElement(
                    "div",
                    { ref, ...rest },
                    children
                )
        ),
    };
});

import WindowShell from "../WindowShell";
import type { WindowShellProps } from "../WindowShell.types";

const buildProps = (
    overrides: Partial<WindowShellProps> = {}
): WindowShellProps => ({
    item: { name: "내문서", type: "FOLDER", status: "active" },
    title: "내문서",
    iconSrc: "icon.png",
    activeProgram: "내문서",
    onActivate: jest.fn(),
    onMinimize: jest.fn(),
    onClose: jest.fn(),
    onRequestZIndex: jest.fn(() => 2),
    ...overrides,
});

describe("WindowShell (characterization)", () => {
    beforeEach(() => {
        localStorage.clear();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("title 과 iconSrc 를 헤더에 렌더한다", () => {
        render(<WindowShell {...buildProps()} />);
        expect(screen.getByText("내문서")).toBeInTheDocument();
        expect(screen.getByAltText("내문서")).toHaveAttribute("src", "icon.png");
    });

    it("창 영역 mouseDown 시 onActivate 가 호출된다", () => {
        const onActivate = jest.fn();
        render(<WindowShell {...buildProps({ onActivate })} />);
        fireEvent.mouseDown(screen.getByText("내문서").parentElement!);
        expect(onActivate).toHaveBeenCalledWith("내문서");
    });

    it("최소화 버튼 클릭 시 onMinimize 가 호출된다", () => {
        const onMinimize = jest.fn();
        render(<WindowShell {...buildProps({ onMinimize })} />);
        fireEvent.click(screen.getByAltText("minimize").parentElement!);
        expect(onMinimize).toHaveBeenCalledWith("내문서");
    });

    it("최대화 버튼 클릭 시 isMaxSize 가 true 로 변경되어 normal 버튼이 노출된다", () => {
        render(<WindowShell {...buildProps()} />);
        fireEvent.click(screen.getByAltText("maximize").parentElement!);
        expect(screen.getByAltText("normal size")).toBeInTheDocument();
    });

    it("닫기 버튼 클릭 시 애니메이션 종료 후 onClose 가 호출된다", () => {
        const onClose = jest.fn();
        render(<WindowShell {...buildProps({ onClose })} />);
        fireEvent.click(screen.getByAltText("close").parentElement!);
        expect(onClose).not.toHaveBeenCalled();
        act(() => {
            jest.advanceTimersByTime(300);
        });
        expect(onClose).toHaveBeenCalledWith("내문서");
    });

    it("활성 상태가 되면 onRequestZIndex 가 호출된다", () => {
        const onRequestZIndex = jest.fn(() => 7);
        render(<WindowShell {...buildProps({ onRequestZIndex })} />);
        expect(onRequestZIndex).toHaveBeenCalled();
    });
});

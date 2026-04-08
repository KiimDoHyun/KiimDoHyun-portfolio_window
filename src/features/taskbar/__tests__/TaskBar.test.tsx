import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskBar from "../TaskBar";
import type { TaskBarProps, TaskbarEntry } from "../TaskBar.types";

const entries: Array<TaskbarEntry> = [
    {
        node: {
            id: "n1",
            parentId: null,
            type: "FOLDER",
            name: "내문서",
            icon: "",
        },
        running: { id: "n1", status: "active", zIndex: 2 },
    },
    {
        node: {
            id: "n2",
            parentId: null,
            type: "FOLDER",
            name: "프로젝트",
            icon: "",
        },
        running: { id: "n2", status: "min", zIndex: 3 },
    },
];

const buildProps = (overrides: Partial<TaskBarProps> = {}): TaskBarProps => ({
    entries,
    activeId: "n1",
    hiddenIcon: false,
    onClickStartIcon: jest.fn(),
    onClickTime: jest.fn(),
    onClickInfo: jest.fn(),
    onClickHiddenIcon: jest.fn(),
    onClickCloseAll: jest.fn(),
    onClickTaskIcon: jest.fn(),
    onCloseProgram: jest.fn(),
    onPreviewChange: jest.fn(),
    renderPreviewContent: jest.fn(() => null),
    ...overrides,
});

describe("TaskBar (characterization)", () => {
    it("entries 의 각 항목을 아이콘으로 렌더링한다", () => {
        render(<TaskBar {...buildProps()} />);
        expect(screen.getByAltText("내문서")).toBeInTheDocument();
        expect(screen.getByAltText("프로젝트")).toBeInTheDocument();
    });

    it("시작 버튼 클릭 시 onClickStartIcon 이 호출된다", () => {
        const onClickStartIcon = jest.fn();
        const { container } = render(
            <TaskBar {...buildProps({ onClickStartIcon })} />
        );
        const startBtn = container.querySelector(".box1") as HTMLElement;
        fireEvent.click(startBtn);
        expect(onClickStartIcon).toHaveBeenCalledTimes(1);
    });

    it("아이콘 클릭 시 해당 entry 로 onClickTaskIcon 이 호출된다", () => {
        const onClickTaskIcon = jest.fn();
        render(<TaskBar {...buildProps({ onClickTaskIcon })} />);
        fireEvent.click(screen.getByAltText("프로젝트"));
        expect(onClickTaskIcon).toHaveBeenCalledTimes(1);
        expect(onClickTaskIcon.mock.calls[0][0].node.name).toBe("프로젝트");
        expect(onClickTaskIcon.mock.calls[0][0].running.status).toBe("min");
    });

    it("아이콘에 mouseEnter 시 onPreviewChange(true) 가 호출되고, leave 시 false", () => {
        const onPreviewChange = jest.fn();
        render(<TaskBar {...buildProps({ onPreviewChange })} />);
        const icon = screen.getByAltText("내문서").closest(".shortCutIcon")!;
        fireEvent.mouseEnter(icon);
        expect(onPreviewChange).toHaveBeenLastCalledWith(true);
        fireEvent.mouseLeave(icon);
        expect(onPreviewChange).toHaveBeenLastCalledWith(false);
    });

    it("activeId 에 해당하는 아이콘은 activeIcon 클래스를 가진다", () => {
        render(<TaskBar {...buildProps({ activeId: "n2" })} />);
        const icon = screen
            .getByAltText("프로젝트")
            .closest(".shortCutIcon") as HTMLElement;
        expect(icon.className).toContain("activeIcon");
    });

    it("hiddenIcon=false 일 때 화살표 위 아이콘을 보여준다", () => {
        render(<TaskBar {...buildProps({ hiddenIcon: false })} />);
        expect(screen.getByAltText("arrowUp")).toBeInTheDocument();
    });

    it("hiddenIcon=true 일 때 화살표 아래 아이콘을 보여준다", () => {
        render(<TaskBar {...buildProps({ hiddenIcon: true })} />);
        expect(screen.getByAltText("arrowDown")).toBeInTheDocument();
    });

    it("hover 중 미리보기 X 버튼 클릭 시 onCloseProgram(hoverId) 호출", () => {
        const onCloseProgram = jest.fn();
        render(<TaskBar {...buildProps({ onCloseProgram })} />);
        const icon = screen.getByAltText("프로젝트").closest(".shortCutIcon")!;
        fireEvent.mouseEnter(icon);
        const closeCover = icon.querySelector(".buttonCover") as HTMLElement;
        fireEvent.click(closeCover);
        expect(onCloseProgram).toHaveBeenCalledWith("n2");
    });

    it("시계 영역 클릭 시 onClickTime, 알림 영역 클릭 시 onClickInfo", () => {
        const onClickTime = jest.fn();
        const onClickInfo = jest.fn();
        const { container } = render(
            <TaskBar {...buildProps({ onClickTime, onClickInfo })} />
        );
        fireEvent.click(container.querySelector(".dateInfo") as HTMLElement);
        expect(onClickTime).toHaveBeenCalledTimes(1);
        fireEvent.click(container.querySelector(".info") as HTMLElement);
        expect(onClickInfo).toHaveBeenCalledTimes(1);
    });

    it("모두 닫기 버튼 클릭 시 onClickCloseAll 호출", () => {
        const onClickCloseAll = jest.fn();
        const { container } = render(
            <TaskBar {...buildProps({ onClickCloseAll })} />
        );
        fireEvent.click(
            container.querySelector(".closeAllButton") as HTMLElement
        );
        expect(onClickCloseAll).toHaveBeenCalledTimes(1);
    });
});

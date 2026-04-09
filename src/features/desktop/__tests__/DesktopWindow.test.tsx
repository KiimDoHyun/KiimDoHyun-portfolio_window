import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DesktopWindow from "../DesktopWindow";
import type { ProgramNode } from "@shared/types/program";

const icons: Array<ProgramNode> = [
    { id: "1", parentId: "root", name: "프로젝트", icon: "", type: "FOLDER" },
    { id: "2", parentId: "root", name: "기술스택", icon: "", type: "FOLDER" },
    {
        id: "3",
        parentId: "root",
        name: "구글",
        icon: "",
        type: "BROWSER",
        url: "https://www.google.com",
    },
];

describe("DesktopWindow", () => {
    it("iconBoxArr의 노드들이 아이콘으로 렌더된다", () => {
        render(
            <DesktopWindow iconBoxArr={icons} onDoubleClickIcon={jest.fn()} />,
        );
        expect(screen.getByText("프로젝트")).toBeInTheDocument();
        expect(screen.getByText("기술스택")).toBeInTheDocument();
        expect(screen.getByText("구글")).toBeInTheDocument();
        expect(screen.getAllByAltText("iconImg")).toHaveLength(3);
    });

    it("아이콘 더블클릭 시 onDoubleClickIcon이 호출된다", () => {
        const handleDoubleClick = jest.fn();
        render(
            <DesktopWindow
                iconBoxArr={icons}
                onDoubleClickIcon={handleDoubleClick}
            />,
        );
        fireEvent.doubleClick(screen.getByText("프로젝트").parentElement!);
        expect(handleDoubleClick).toHaveBeenCalledWith(icons[0]);
    });

    it("빈 배열이면 아이콘이 렌더되지 않는다", () => {
        render(
            <DesktopWindow iconBoxArr={[]} onDoubleClickIcon={jest.fn()} />,
        );
        expect(screen.queryAllByAltText("iconImg")).toHaveLength(0);
    });
});

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FolderGrid from "../ui/FolderGrid";
import type { ProgramNode, ProgramId } from "@shared/types/program";

const folderWithChildren: ProgramNode = {
    id: "f1",
    parentId: "root",
    name: "프로젝트",
    icon: "",
    type: "FOLDER",
};

const emptyFolder: ProgramNode = {
    id: "f2",
    parentId: "root",
    name: "빈폴더",
    icon: "",
    type: "FOLDER",
};

const imageNode: ProgramNode = {
    id: "img1",
    parentId: "f1",
    name: "사진.png",
    icon: "photo.png",
    type: "IMAGE",
    src: "photo.png",
};

const items: Array<ProgramNode> = [folderWithChildren, emptyFolder, imageNode];

const hasChildren = (id: ProgramId) => id === "f1";

describe("FolderGrid", () => {
    const defaultProps = {
        items,
        displayType: "MIDDLE_ICON",
        selectedId: null as ProgramId | null,
        hasChildren,
        onClickItem: jest.fn(),
        onDoubleClickItem: jest.fn(),
    };

    it("아이템 이름들을 렌더한다", () => {
        render(<FolderGrid {...defaultProps} />);
        expect(screen.getByText("프로젝트")).toBeInTheDocument();
        expect(screen.getByText("빈폴더")).toBeInTheDocument();
        expect(screen.getByText("사진.png")).toBeInTheDocument();
    });

    it("hasChildren=true인 폴더는 folder_full 이미지를 사용한다", () => {
        render(<FolderGrid {...defaultProps} />);
        const imgs = screen.getAllByRole("img");
        const folderFullImg = imgs.find((img) =>
            (img as HTMLImageElement).src.includes("folder_full"),
        );
        expect(folderFullImg).toBeDefined();
    });

    it("hasChildren=false인 폴더는 folder_empty 이미지를 사용한다", () => {
        render(<FolderGrid {...defaultProps} />);
        const imgs = screen.getAllByRole("img");
        const folderEmptyImg = imgs.find((img) =>
            (img as HTMLImageElement).src.includes("folder_empty"),
        );
        expect(folderEmptyImg).toBeDefined();
    });

    it("아이템 클릭 시 onClickItem이 호출된다", () => {
        const onClickItem = jest.fn();
        render(<FolderGrid {...defaultProps} onClickItem={onClickItem} />);
        fireEvent.click(screen.getByText("프로젝트").closest(".folder")!);
        expect(onClickItem).toHaveBeenCalledWith("f1");
    });

    it("아이템 더블클릭 시 onDoubleClickItem이 호출된다", () => {
        const onDoubleClickItem = jest.fn();
        render(
            <FolderGrid
                {...defaultProps}
                onDoubleClickItem={onDoubleClickItem}
            />,
        );
        fireEvent.doubleClick(
            screen.getByText("프로젝트").closest(".folder")!,
        );
        expect(onDoubleClickItem).toHaveBeenCalledWith(folderWithChildren);
    });

    it("selectedId와 일치하는 아이템에 folder_selected 클래스가 적용된다", () => {
        render(<FolderGrid {...defaultProps} selectedId="f1" />);
        const el = screen.getByText("프로젝트").closest(".folder")!;
        expect(el).toHaveClass("folder_selected");
    });

    it("items가 빈 배열이면 '비어있습니다.'를 표시한다", () => {
        render(<FolderGrid {...defaultProps} items={[]} />);
        expect(screen.getByText("비어있습니다.")).toBeInTheDocument();
    });

    it("DETAIL 모드일 때 헤더 행을 렌더한다", () => {
        render(<FolderGrid {...defaultProps} displayType="DETAIL" />);
        expect(screen.getByText("이미지")).toBeInTheDocument();
        expect(screen.getByText("유형")).toBeInTheDocument();
    });
});

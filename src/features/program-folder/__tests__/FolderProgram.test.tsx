import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DesktopDataContext } from "@pages/DesktopPage/DesktopDataContext";
import type {
    DirectoryItem,
    DirectoryTree,
} from "@pages/DesktopPage/DesktopDataContext";
import FolderProgram from "../FolderProgram";

const mockDirectory: Array<DirectoryItem> = [
    {
        name: "프로젝트",
        type: "FOLDER",
        icon: "",
        parent: "root",
        route: "/ KDH / 프로젝트",
    },
    {
        name: "(주)아라온소프트",
        type: "FOLDER",
        icon: "",
        parent: "프로젝트",
        route: "/ KDH / 프로젝트 / (주)아라온소프트",
    },
    {
        name: "빈폴더",
        type: "FOLDER",
        icon: "",
        parent: "프로젝트",
        route: "/ KDH / 프로젝트 / 빈폴더",
    },
];

const mockTree: DirectoryTree = {
    프로젝트: [
        {
            name: "(주)아라온소프트",
            type: "FOLDER",
            icon: "",
            parent: "프로젝트",
        },
    ],
    "(주)아라온소프트": [
        {
            name: "샘플DOC",
            type: "DOC",
            icon: "",
            parent: "(주)아라온소프트",
        },
    ],
};

const renderWithDesktopData = (ui: React.ReactElement) => {
    const openProgram = jest.fn();
    return {
        openProgram,
        ...render(
            <DesktopDataContext.Provider
                value={{
                    directory: mockDirectory,
                    directoryTree: mockTree,
                    openProgram,
                }}
            >
                {ui}
            </DesktopDataContext.Provider>
        ),
    };
};

describe("FolderProgram (characterization)", () => {
    it("초기 폴더의 자식 항목들을 렌더한다", () => {
        renderWithDesktopData(<FolderProgram name="프로젝트" type="FOLDER" />);
        expect(screen.getByText("(주)아라온소프트")).toBeInTheDocument();
    });

    it("아이템 클릭 시 selected 상태가 된다", () => {
        renderWithDesktopData(<FolderProgram name="프로젝트" type="FOLDER" />);
        const folderEl = screen.getByText("(주)아라온소프트").closest(".folder");
        expect(folderEl).not.toBeNull();
        fireEvent.click(folderEl!);
        expect(folderEl).toHaveClass("folder_selected");
    });

    it("폴더 더블클릭 시 해당 폴더로 진입한다", () => {
        renderWithDesktopData(<FolderProgram name="프로젝트" type="FOLDER" />);
        const folderEl = screen.getByText("(주)아라온소프트").closest(".folder");
        fireEvent.doubleClick(folderEl!);
        expect(screen.getByText("샘플DOC")).toBeInTheDocument();
    });

    it("뒤로가기 클릭 시 부모 폴더로 이동한다", () => {
        renderWithDesktopData(
            <FolderProgram name="(주)아라온소프트" type="FOLDER" />
        );
        expect(screen.getByText("샘플DOC")).toBeInTheDocument();
        fireEvent.click(screen.getByAltText("leftArrow"));
        expect(screen.getByText("(주)아라온소프트")).toBeInTheDocument();
    });

    it("표시 방식 select 변경 시 className이 갱신된다", () => {
        const { container } = renderWithDesktopData(
            <FolderProgram name="프로젝트" type="FOLDER" />
        );
        const select = container.querySelector("select");
        expect(select).not.toBeNull();
        fireEvent.change(select!, { target: { value: "BIG_ICON" } });
        expect(
            container.querySelector(".BIG_ICON.contentsArea_folder")
        ).not.toBeNull();
    });

    it("빈 폴더는 '비어있습니다.'를 표시한다", () => {
        renderWithDesktopData(<FolderProgram name="빈폴더" type="FOLDER" />);
        expect(screen.getByText("비어있습니다.")).toBeInTheDocument();
    });
});

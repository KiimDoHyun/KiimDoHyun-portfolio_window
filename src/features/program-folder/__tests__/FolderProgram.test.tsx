import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
    hydrateTestFileSystem,
    findIdByName,
} from "../../../test-utils/hydrateFileSystem";
import FolderProgram from "../FolderProgram";
import { useRunningProgramsStore } from "@store/runningProgramsStore";
import type { PortfolioSchema } from "@shared/types/portfolio-schema";

const schema: PortfolioSchema = {
    version: 1,
    root: {
        type: "FOLDER",
        name: "root",
        icon: "",
        children: [
            {
                type: "FOLDER",
                name: "프로젝트",
                icon: "",
                children: [
                    {
                        type: "FOLDER",
                        name: "(주)아라온소프트",
                        icon: "",
                        children: [
                            {
                                type: "DOC",
                                name: "샘플DOC",
                                icon: "",
                                contents: {} as any,
                            },
                        ],
                    },
                    {
                        type: "FOLDER",
                        name: "빈폴더",
                        icon: "",
                        children: [],
                    },
                ],
            },
        ],
    },
};

describe("FolderProgram", () => {
    beforeEach(() => hydrateTestFileSystem(schema));

    it("초기 폴더의 자식 항목들을 렌더한다", () => {
        render(<FolderProgram id={findIdByName("프로젝트")} />);
        expect(screen.getByText("(주)아라온소프트")).toBeInTheDocument();
    });

    it("아이템 클릭 시 selected 상태가 된다", () => {
        render(<FolderProgram id={findIdByName("프로젝트")} />);
        const el = screen.getByText("(주)아라온소프트").closest(".folder")!;
        fireEvent.click(el);
        expect(el).toHaveClass("folder_selected");
    });

    it("폴더 더블클릭 시 해당 폴더로 진입한다", () => {
        render(<FolderProgram id={findIdByName("프로젝트")} />);
        const el = screen.getByText("(주)아라온소프트").closest(".folder")!;
        fireEvent.doubleClick(el);
        expect(screen.getByText("샘플DOC")).toBeInTheDocument();
    });

    it("뒤로가기 클릭 시 부모 폴더로 이동한다", () => {
        render(<FolderProgram id={findIdByName("(주)아라온소프트")} />);
        expect(screen.getByText("샘플DOC")).toBeInTheDocument();
        fireEvent.click(screen.getByAltText("leftArrow"));
        expect(screen.getByText("(주)아라온소프트")).toBeInTheDocument();
    });

    it("표시 방식 select 변경 시 className이 갱신된다", () => {
        const { container } = render(
            <FolderProgram id={findIdByName("프로젝트")} />
        );
        const select = container.querySelector("select")!;
        fireEvent.change(select, { target: { value: "BIG_ICON" } });
        expect(
            container.querySelector(".BIG_ICON.contentsArea_folder")
        ).not.toBeNull();
    });

    it("빈 폴더는 '비어있습니다.'를 표시한다", () => {
        render(<FolderProgram id={findIdByName("빈폴더")} />);
        expect(screen.getByText("비어있습니다.")).toBeInTheDocument();
    });

    it("폴더가 아닌 항목을 더블클릭하면 runningPrograms에 열린다", () => {
        render(<FolderProgram id={findIdByName("(주)아라온소프트")} />);
        const el = screen.getByText("샘플DOC").closest(".folder")!;
        fireEvent.doubleClick(el);
        expect(useRunningProgramsStore.getState().activeId).toBe(
            findIdByName("샘플DOC")
        );
    });
});

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
    hydrateTestFileSystem,
    findIdByName,
} from "../../../test-utils/hydrateFileSystem";
import DesktopWindow from "../DesktopWindow";
import { useRunningProgramsStore } from "@store/runningProgramsStore";
import type { PortfolioSchema } from "@shared/types/portfolio-schema";

const schema: PortfolioSchema = {
    version: 1,
    root: {
        type: "FOLDER",
        name: "root",
        icon: "",
        children: [
            { type: "FOLDER", name: "프로젝트", icon: "", children: [] },
            { type: "FOLDER", name: "기술스택", icon: "", children: [] },
            {
                type: "BROWSER",
                name: "구글",
                icon: "",
                url: "https://www.google.com",
            },
        ],
    },
};

describe("DesktopWindow", () => {
    beforeEach(() => hydrateTestFileSystem(schema));

    it("루트 폴더의 자식들이 아이콘으로 렌더된다", () => {
        render(<DesktopWindow />);
        expect(screen.getByText("프로젝트")).toBeInTheDocument();
        expect(screen.getByText("기술스택")).toBeInTheDocument();
        expect(screen.getByText("구글")).toBeInTheDocument();
        expect(screen.getAllByAltText("iconImg")).toHaveLength(3);
    });

    it("아이콘 더블클릭 시 runningProgramsStore.open 이 호출된다", () => {
        render(<DesktopWindow />);
        fireEvent.doubleClick(screen.getByText("프로젝트").parentElement!);
        expect(useRunningProgramsStore.getState().activeId).toBe(
            findIdByName("프로젝트")
        );
    });
});

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
    hydrateTestFileSystem,
    findIdByName,
} from "../../../test-utils/hydrateFileSystem";
import ImageProgram from "../ImageProgram";
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
                name: "갤러리",
                icon: "",
                children: [
                    { type: "IMAGE", name: "사진1", icon: "", src: "img1.png" },
                    { type: "IMAGE", name: "사진2", icon: "", src: "img2.png" },
                    { type: "IMAGE", name: "사진3", icon: "", src: "img3.png" },
                    {
                        type: "DOC",
                        name: "메모",
                        icon: "",
                        contents: {} as any,
                    },
                ],
            },
            { type: "FOLDER", name: "빈갤러리", icon: "", children: [] },
        ],
    },
};

describe("ImageProgram", () => {
    beforeEach(() => hydrateTestFileSystem(schema));

    it("부모 폴더의 IMAGE 항목만 추리고 현재 이미지를 보여준다", () => {
        render(<ImageProgram id={findIdByName("사진2")} />);
        const img = screen.getByAltText("사진2") as HTMLImageElement;
        expect(img).toBeInTheDocument();
        expect(img.src).toContain("img2.png");
        expect(screen.getByText(/2 \/ 3/)).toBeInTheDocument();
    });

    it("오른쪽 화살표 클릭 시 다음 이미지로 이동한다", () => {
        render(<ImageProgram id={findIdByName("사진1")} />);
        fireEvent.click(screen.getByAltText("collapseArrowRight").parentElement!);
        expect(screen.getByAltText("사진2")).toBeInTheDocument();
        expect(screen.getByText(/2 \/ 3/)).toBeInTheDocument();
    });

    it("마지막 이미지에서 오른쪽 클릭은 인덱스를 유지한다", () => {
        render(<ImageProgram id={findIdByName("사진3")} />);
        fireEvent.click(screen.getByAltText("collapseArrowRight").parentElement!);
        expect(screen.getByAltText("사진3")).toBeInTheDocument();
    });

    it("왼쪽 화살표 클릭 시 이전 이미지로 이동한다", () => {
        render(<ImageProgram id={findIdByName("사진2")} />);
        fireEvent.click(screen.getByAltText("collapseArrowLeft").parentElement!);
        expect(screen.getByAltText("사진1")).toBeInTheDocument();
    });

    it("확대/축소 시 % 표시가 갱신된다", () => {
        render(<ImageProgram id={findIdByName("사진1")} />);
        expect(screen.getByText("100 %")).toBeInTheDocument();
        fireEvent.click(screen.getByAltText("확대").parentElement!);
        expect(screen.getByText("120 %")).toBeInTheDocument();
        fireEvent.click(screen.getByAltText("축소").parentElement!);
        expect(screen.getByText("100 %")).toBeInTheDocument();
    });

    it("기본 설정으로 클릭 시 배율이 100%로 복원된다", () => {
        render(<ImageProgram id={findIdByName("사진1")} />);
        fireEvent.click(screen.getByAltText("확대").parentElement!);
        fireEvent.click(screen.getByAltText("확대").parentElement!);
        expect(screen.getByText("140 %")).toBeInTheDocument();
        fireEvent.click(screen.getByAltText("화면맞춤").parentElement!);
        expect(screen.getByText("100 %")).toBeInTheDocument();
    });
});

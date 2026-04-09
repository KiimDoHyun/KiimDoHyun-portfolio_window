import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ImageProgram from "../ImageProgram";
import type { ProgramNode } from "@shared/types/program";

const makeImage = (id: string, name: string, src: string): ProgramNode => ({
    id,
    parentId: "parent",
    name,
    icon: "",
    type: "IMAGE",
    src,
});

const images: Array<ProgramNode> = [
    makeImage("img1", "사진1", "react"),
    makeImage("img2", "사진2", "javascript"),
    makeImage("img3", "사진3", "redux"),
];

describe("ImageProgram", () => {
    it("부모 폴더의 IMAGE 항목만 추리고 현재 이미지를 보여준다", () => {
        render(<ImageProgram images={images} currentId="img2" />);
        const img = screen.getByAltText("사진2") as HTMLImageElement;
        expect(img).toBeInTheDocument();
        expect(img.src).toContain("javascript");
        expect(screen.getByText(/2 \/ 3/)).toBeInTheDocument();
    });

    it("오른쪽 화살표 클릭 시 다음 이미지로 이동한다", () => {
        render(<ImageProgram images={images} currentId="img1" />);
        fireEvent.click(screen.getByAltText("collapseArrowRight").parentElement!);
        expect(screen.getByAltText("사진2")).toBeInTheDocument();
        expect(screen.getByText(/2 \/ 3/)).toBeInTheDocument();
    });

    it("마지막 이미지에서 오른쪽 클릭은 인덱스를 유지한다", () => {
        render(<ImageProgram images={images} currentId="img3" />);
        fireEvent.click(screen.getByAltText("collapseArrowRight").parentElement!);
        expect(screen.getByAltText("사진3")).toBeInTheDocument();
    });

    it("왼쪽 화살표 클릭 시 이전 이미지로 이동한다", () => {
        render(<ImageProgram images={images} currentId="img2" />);
        fireEvent.click(screen.getByAltText("collapseArrowLeft").parentElement!);
        expect(screen.getByAltText("사진1")).toBeInTheDocument();
    });

    it("확대/축소 시 % 표시가 갱신된다", () => {
        render(<ImageProgram images={images} currentId="img1" />);
        expect(screen.getByText("100 %")).toBeInTheDocument();
        fireEvent.click(screen.getByAltText("확대").parentElement!);
        expect(screen.getByText("120 %")).toBeInTheDocument();
        fireEvent.click(screen.getByAltText("축소").parentElement!);
        expect(screen.getByText("100 %")).toBeInTheDocument();
    });

    it("기본 설정으로 클릭 시 배율이 100%로 복원된다", () => {
        render(<ImageProgram images={images} currentId="img1" />);
        fireEvent.click(screen.getByAltText("확대").parentElement!);
        fireEvent.click(screen.getByAltText("확대").parentElement!);
        expect(screen.getByText("140 %")).toBeInTheDocument();
        fireEvent.click(screen.getByAltText("화면맞춤").parentElement!);
        expect(screen.getByText("100 %")).toBeInTheDocument();
    });
});

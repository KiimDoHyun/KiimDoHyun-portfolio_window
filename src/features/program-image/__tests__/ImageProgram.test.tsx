import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
    DesktopDataContext,
    DirectoryItem,
    DirectoryTree,
} from "@pages/DesktopPage/DesktopDataContext";
import ImageProgram from "../ImageProgram";

const mockTree: DirectoryTree = {
    갤러리: [
        { name: "사진1", type: "IMAGE", icon: "img1.png", parent: "갤러리" },
        { name: "사진2", type: "IMAGE", icon: "img2.png", parent: "갤러리" },
        { name: "사진3", type: "IMAGE", icon: "img3.png", parent: "갤러리" },
        { name: "메모", type: "DOC", icon: "doc.png", parent: "갤러리" },
    ],
};

const mockDirectory: Array<DirectoryItem> = [];

const renderWithDesktopData = (ui: React.ReactElement) =>
    render(
        <DesktopDataContext.Provider
            value={{
                directory: mockDirectory,
                directoryTree: mockTree,
                openProgram: jest.fn(),
            }}
        >
            {ui}
        </DesktopDataContext.Provider>
    );

describe("ImageProgram (characterization)", () => {
    it("부모 폴더의 IMAGE 항목만 추리고 현재 이미지를 보여준다", () => {
        renderWithDesktopData(
            <ImageProgram type="IMAGE" parent="갤러리" name="사진2" />
        );
        const img = screen.getByAltText("사진2") as HTMLImageElement;
        expect(img).toBeInTheDocument();
        expect(img.src).toContain("img2.png");
        expect(screen.getByText(/2 \/ 3/)).toBeInTheDocument();
    });

    it("오른쪽 화살표 클릭 시 다음 이미지로 이동한다", () => {
        renderWithDesktopData(
            <ImageProgram type="IMAGE" parent="갤러리" name="사진1" />
        );
        fireEvent.click(screen.getByAltText("collapseArrowRight").parentElement!);
        expect(screen.getByAltText("사진2")).toBeInTheDocument();
        expect(screen.getByText(/2 \/ 3/)).toBeInTheDocument();
    });

    it("마지막 이미지에서 오른쪽 클릭은 인덱스를 유지한다", () => {
        renderWithDesktopData(
            <ImageProgram type="IMAGE" parent="갤러리" name="사진3" />
        );
        fireEvent.click(
            screen.getByAltText("collapseArrowRight").parentElement!
        );
        expect(screen.getByAltText("사진3")).toBeInTheDocument();
    });

    it("왼쪽 화살표 클릭 시 이전 이미지로 이동한다", () => {
        renderWithDesktopData(
            <ImageProgram type="IMAGE" parent="갤러리" name="사진2" />
        );
        fireEvent.click(screen.getByAltText("collapseArrowLeft").parentElement!);
        expect(screen.getByAltText("사진1")).toBeInTheDocument();
    });

    it("확대/축소 시 % 표시가 갱신된다", () => {
        renderWithDesktopData(
            <ImageProgram type="IMAGE" parent="갤러리" name="사진1" />
        );
        expect(screen.getByText("100 %")).toBeInTheDocument();
        fireEvent.click(screen.getByAltText("확대").parentElement!);
        expect(screen.getByText("120 %")).toBeInTheDocument();
        fireEvent.click(screen.getByAltText("축소").parentElement!);
        expect(screen.getByText("100 %")).toBeInTheDocument();
    });

    it("기본 설정으로 클릭 시 배율이 100%로 복원된다", () => {
        renderWithDesktopData(
            <ImageProgram type="IMAGE" parent="갤러리" name="사진1" />
        );
        fireEvent.click(screen.getByAltText("확대").parentElement!);
        fireEvent.click(screen.getByAltText("확대").parentElement!);
        expect(screen.getByText("140 %")).toBeInTheDocument();
        fireEvent.click(screen.getByAltText("화면맞춤").parentElement!);
        expect(screen.getByText("100 %")).toBeInTheDocument();
    });

    it("부모 폴더에 이미지가 없으면 카운터가 0/0이다", () => {
        renderWithDesktopData(
            <ImageProgram type="IMAGE" parent="없음" name="x" />
        );
        expect(screen.getByText(/1 \/ 0/)).toBeInTheDocument();
    });
});

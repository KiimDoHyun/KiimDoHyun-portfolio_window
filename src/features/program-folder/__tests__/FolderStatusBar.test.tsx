import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FolderStatusBar from "../ui/FolderStatusBar";

describe("FolderStatusBar", () => {
    it("선택이 없으면 항목 개수만 렌더한다", () => {
        const { container } = render(
            <FolderStatusBar totalCount={3} selectedCount={0} />,
        );
        expect(screen.getByText("3개 항목")).toBeInTheDocument();
        expect(screen.queryByText(/선택함$/)).not.toBeInTheDocument();
        expect(container.querySelectorAll("span").length).toBe(1);
    });

    it("선택이 1개면 '선택함' 부분이 추가로 렌더된다", () => {
        render(<FolderStatusBar totalCount={3} selectedCount={1} />);
        expect(screen.getByText("3개 항목")).toBeInTheDocument();
        expect(screen.getByText("1개 항목 선택함")).toBeInTheDocument();
    });

    it("빈 폴더는 '0개 항목' 한 span 만 렌더한다", () => {
        const { container } = render(
            <FolderStatusBar totalCount={0} selectedCount={0} />,
        );
        expect(screen.getByText("0개 항목")).toBeInTheDocument();
        expect(container.querySelectorAll("span").length).toBe(1);
    });

    it("선택이 다수면 그 개수가 노출된다", () => {
        render(<FolderStatusBar totalCount={5} selectedCount={2} />);
        expect(screen.getByText("5개 항목")).toBeInTheDocument();
        expect(screen.getByText("2개 항목 선택함")).toBeInTheDocument();
    });
});

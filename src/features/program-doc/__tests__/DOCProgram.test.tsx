import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DOCProgram from "../DOCProgram";
import type { ProjectData } from "@shared/types/content";

const baseProject: ProjectData = {
    projectName: "포트폴리오 윈도우",
    projectDesc: "## 소개\n\n윈도우 OS 컨셉의 포트폴리오 사이트\n\n- 항목 1\n- 항목 2",
    projectTerm: "2024.01 ~ 2024.06",
    department: "혼자",
};

const emptyDescProject: ProjectData = {
    ...baseProject,
    projectName: "설명없음",
    projectDesc: "",
};

const noTermProject: ProjectData = {
    ...baseProject,
    projectName: "기간없음",
    projectTerm: "",
};

describe("DOCProgram", () => {
    it("헤더에 프로젝트명을 렌더한다", () => {
        render(<DOCProgram contents={baseProject} />);
        expect(screen.getByText(baseProject.projectName)).toBeInTheDocument();
    });

    it("헤더에 프로젝트 기간을 렌더한다", () => {
        render(<DOCProgram contents={baseProject} />);
        expect(screen.getByText(baseProject.projectTerm)).toBeInTheDocument();
    });

    it("본문에 마크다운을 렌더한다", () => {
        render(<DOCProgram contents={baseProject} />);
        expect(screen.getByText("소개")).toBeInTheDocument();
        expect(screen.getByText("항목 1")).toBeInTheDocument();
    });

    it("projectDesc가 빈 문자열이면 본문이 비어있다", () => {
        const { container } = render(<DOCProgram contents={emptyDescProject} />);
        const body = container.querySelector(".doc_body");
        expect(body?.textContent).toBe("");
    });

    it("projectTerm이 빈 문자열이면 기간을 렌더하지 않는다", () => {
        render(<DOCProgram contents={noTermProject} />);
        const termElements = document.querySelectorAll(".doc_projectTerm");
        expect(termElements.length).toBe(0);
    });
});

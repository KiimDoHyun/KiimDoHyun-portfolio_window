import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DOCProgram from "../DOCProgram";
import {
    hydrateTestFileSystem,
    findIdByName,
} from "../../../test-utils/hydrateFileSystem";
import type { PortfolioSchema } from "@shared/types/portfolio-schema";
import type { ProjectData } from "@shared/types/content";

const richProject: ProjectData = {
    projectName: "포트폴리오 윈도우",
    projectDesc: "윈도우 OS 컨셉의 포트폴리오 사이트",
    projectImages: ["a.png", "b.png"],
    projectTerm: ["2024.01 ~ 2024.06"],
    projectType: "개인",
    projectReulst: [
        { title: "성과1", content: "내용1" },
        { title: "성과2", content: "내용2" },
    ],
    role: ["Front-end"],
    department: "혼자",
    stack: [
        { name: "React", img: "react.png" },
        { name: "TypeScript", img: "ts.png" },
    ],
    url: "https://example.com",
};

const noImageProject: ProjectData = {
    ...richProject,
    projectName: "이미지없음",
    projectImages: [],
};

const noUrlProject: ProjectData = {
    ...richProject,
    projectName: "URL없음",
    url: "",
};

const schema: PortfolioSchema = {
    version: 1,
    root: {
        type: "FOLDER",
        name: "root",
        icon: "",
        children: [
            {
                type: "DOC",
                name: richProject.projectName,
                icon: "",
                contents: richProject,
            },
            {
                type: "DOC",
                name: noImageProject.projectName,
                icon: "",
                contents: noImageProject,
            },
            {
                type: "DOC",
                name: noUrlProject.projectName,
                icon: "",
                contents: noUrlProject,
            },
        ],
    },
};

describe("DOCProgram", () => {
    beforeEach(() => hydrateTestFileSystem(schema));

    it("프로젝트명을 렌더한다", () => {
        render(<DOCProgram id={findIdByName(richProject.projectName)} />);
        expect(
            screen.getAllByText(richProject.projectName).length
        ).toBeGreaterThan(0);
    });

    it("프로젝트 설명을 렌더한다", () => {
        render(<DOCProgram id={findIdByName(richProject.projectName)} />);
        expect(screen.getByText(richProject.projectDesc)).toBeInTheDocument();
    });

    it("프로젝트 성과 항목들을 렌더한다", () => {
        render(<DOCProgram id={findIdByName(richProject.projectName)} />);
        richProject.projectReulst.forEach((r) => {
            expect(screen.getByText(r.content)).toBeInTheDocument();
        });
    });

    it("스택 아이템 이름들을 렌더한다", () => {
        render(<DOCProgram id={findIdByName(richProject.projectName)} />);
        richProject.stack.forEach((s) => {
            expect(screen.getByText(s.name)).toBeInTheDocument();
        });
    });

    it("프로젝트 이미지가 없을 때 안내 문구를 표시한다", () => {
        render(<DOCProgram id={findIdByName(noImageProject.projectName)} />);
        expect(
            screen.getByText("프로젝트 이미지가 없습니다.")
        ).toBeInTheDocument();
    });

    it("url이 비어있을 때 '공개된 URL 없음'을 표시한다", () => {
        render(<DOCProgram id={findIdByName(noUrlProject.projectName)} />);
        expect(screen.getByText("공개된 URL 없음")).toBeInTheDocument();
    });
});

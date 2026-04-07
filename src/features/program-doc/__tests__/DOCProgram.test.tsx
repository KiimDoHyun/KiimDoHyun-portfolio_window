import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DOCProgram from "../DOCProgram";
import { projectDatas } from "@shared/lib/data";

describe("DOCProgram (characterization)", () => {
    // 풍부한 데이터를 가진 프로젝트 (이미지/결과/url 있음)
    const richProject = projectDatas.find(
        (p: any) => p.projectImages?.length > 0 && p.projectReulst?.length > 0
    )!;

    // 이미지가 없는 프로젝트
    const noImageProject = projectDatas.find(
        (p: any) => !p.projectImages || p.projectImages.length === 0
    );

    // url이 없는(빈 문자열) 프로젝트
    const noUrlProject = projectDatas.find((p: any) => !p.url);

    it("프로젝트명을 렌더한다", () => {
        render(
            <DOCProgram type="DOC" name={richProject.projectName} />
        );
        expect(
            screen.getAllByText(richProject.projectName).length
        ).toBeGreaterThan(0);
    });

    it("프로젝트 설명을 렌더한다", () => {
        render(
            <DOCProgram type="DOC" name={richProject.projectName} />
        );
        expect(screen.getByText(richProject.projectDesc)).toBeInTheDocument();
    });

    it("프로젝트 성과 항목들을 렌더한다", () => {
        render(
            <DOCProgram type="DOC" name={richProject.projectName} />
        );
        richProject.projectReulst.forEach((r: any) => {
            // 제목은 "1. 제목" 형태로 렌더되므로 부분 매칭 (여러 노드에 매칭될 수 있음)
            expect(
                screen.getAllByText(
                    (_, node) => {
                        if (!node) return false;
                        const hasText = (n: Element) =>
                            n.textContent?.includes(r.title) ?? false;
                        const nodeHasText = hasText(node);
                        const childrenDontHaveText = Array.from(
                            node.children
                        ).every((child) => !hasText(child));
                        return nodeHasText && childrenDontHaveText;
                    }
                ).length
            ).toBeGreaterThan(0);
            expect(screen.getByText(r.content)).toBeInTheDocument();
        });
    });

    it("스택 아이템 이름들을 렌더한다", () => {
        render(
            <DOCProgram type="DOC" name={richProject.projectName} />
        );
        richProject.stack.forEach((s: any) => {
            expect(screen.getByText(s.name)).toBeInTheDocument();
        });
    });

    it("프로젝트 이미지가 없을 때 안내 문구를 표시한다", () => {
        if (!noImageProject) return;
        render(
            <DOCProgram
                type="DOC"
                name={noImageProject.projectName}
            />
        );
        expect(
            screen.getByText("프로젝트 이미지가 없습니다.")
        ).toBeInTheDocument();
    });

    it("url이 비어있을 때 '공개된 URL 없음'을 표시한다", () => {
        if (!noUrlProject) return;
        render(
            <DOCProgram type="DOC" name={noUrlProject.projectName} />
        );
        expect(screen.getByText("공개된 URL 없음")).toBeInTheDocument();
    });
});

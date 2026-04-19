import { selectStatusBarViewModel } from "../selectors/selectStatusBarViewModel";
import { buildFileSystem, _resetIdCounterForTests } from "../buildFileSystem";
import type { PortfolioSchema } from "@shared/types/portfolio-schema";
import type { ProjectData } from "@shared/types/content";

const emptyDoc: ProjectData = {
    projectName: "",
    projectDesc: "",
    projectTerm: "",
    department: "",
};

function makeSchema(): PortfolioSchema {
    return {
        version: 1,
        root: {
            type: "FOLDER",
            name: "root",
            icon: "",
            children: [
                {
                    type: "INFO",
                    name: "내컴퓨터",
                    icon: "",
                    contents: {
                        name: "",
                        email: "",
                        phone: "",
                        photo: "",
                        summary: "",
                        links: [],
                        details: [],
                    },
                },
                {
                    type: "FOLDER",
                    name: "현직",
                    icon: "",
                    children: [
                        {
                            type: "FOLDER",
                            name: "와탭랩스",
                            icon: "",
                            children: [
                                { type: "DOC", name: "DOC_A", icon: "", contents: emptyDoc },
                                { type: "DOC", name: "DOC_B", icon: "", contents: emptyDoc },
                            ],
                        },
                    ],
                },
                {
                    type: "FOLDER",
                    name: "경력",
                    icon: "",
                    children: [
                        {
                            type: "FOLDER",
                            name: "아라온",
                            icon: "",
                            children: [
                                { type: "DOC", name: "DOC_C", icon: "", contents: emptyDoc },
                            ],
                        },
                    ],
                },
                {
                    type: "FOLDER",
                    name: "기술스택",
                    icon: "",
                    children: [
                        {
                            type: "FOLDER",
                            name: "주로 사용하는 기술 스택",
                            icon: "",
                            children: [
                                { type: "IMAGE", name: "React", icon: "", src: "" },
                                { type: "IMAGE", name: "TS", icon: "", src: "" },
                            ],
                        },
                        {
                            type: "FOLDER",
                            name: "사용해본적은 있는 기술",
                            icon: "",
                            children: [
                                { type: "IMAGE", name: "Vue", icon: "", src: "" },
                            ],
                        },
                    ],
                },
            ],
        },
    };
}

describe("selectStatusBarViewModel", () => {
    beforeEach(() => {
        _resetIdCounterForTests();
    });

    it("projects: 루트 직계에서 내컴퓨터/기술스택 및 비-FOLDER 노드를 제외한다", () => {
        const fs = buildFileSystem(makeSchema());
        const vm = selectStatusBarViewModel(fs);
        const rootNames = vm.projects
            .filter((p) => p.depth === 0)
            .map((p) => p.name);
        expect(rootNames).toEqual(["현직", "경력"]);
    });

    it("projects: DFS 순서로 평탄화되고 depth 값이 정확하다", () => {
        const fs = buildFileSystem(makeSchema());
        const vm = selectStatusBarViewModel(fs);
        const shape = vm.projects.map((p) => [p.name, p.depth]);
        expect(shape).toEqual([
            ["현직", 0],
            ["와탭랩스", 1],
            ["DOC_A", 2],
            ["DOC_B", 2],
            ["경력", 0],
            ["아라온", 1],
            ["DOC_C", 2],
        ]);
    });

    it("projects: 카테고리 폴더 이름이 바뀌어도 동일 개수를 반환한다 (이름 의존성 없음)", () => {
        const schema = makeSchema();
        schema.root.type === "FOLDER" &&
            schema.root.children.forEach((c) => {
                if (c.type === "FOLDER" && c.name === "현직") c.name = "직장";
                if (c.type === "FOLDER" && c.name === "경력") c.name = "과거";
            });
        const fs = buildFileSystem(schema);
        const vm = selectStatusBarViewModel(fs);
        expect(vm.projects).toHaveLength(7);
    });

    it("techStack: 기술스택 폴더 하위만 반환하고 시작 노드 자체는 제외한다", () => {
        const fs = buildFileSystem(makeSchema());
        const vm = selectStatusBarViewModel(fs);
        const names = vm.techStack.map((t) => t.name);
        expect(names).toEqual([
            "주로 사용하는 기술 스택",
            "React",
            "TS",
            "사용해본적은 있는 기술",
            "Vue",
        ]);
        expect(names).not.toContain("기술스택");
    });

    it("techStack: 서브폴더명이 영문이든 한글이든 동일 구조를 반환한다 (이름 의존성 없음)", () => {
        const schema = makeSchema();
        schema.root.type === "FOLDER" &&
            schema.root.children.forEach((c) => {
                if (c.type === "FOLDER" && c.name === "기술스택") {
                    c.children.forEach((sub) => {
                        if (sub.type === "FOLDER" && sub.name === "주로 사용하는 기술 스택")
                            sub.name = "MAIN_TECH";
                        if (sub.type === "FOLDER" && sub.name === "사용해본적은 있는 기술")
                            sub.name = "SUB_TECH";
                    });
                }
            });
        const fs = buildFileSystem(schema);
        const vm = selectStatusBarViewModel(fs);
        expect(vm.techStack.map((t) => t.type)).toEqual([
            "FOLDER",
            "IMAGE",
            "IMAGE",
            "FOLDER",
            "IMAGE",
        ]);
    });

    it("myComputerId: 내컴퓨터 노드의 id 를 반환한다", () => {
        const fs = buildFileSystem(makeSchema());
        const vm = selectStatusBarViewModel(fs);
        const myComputer = Object.values(fs.nodes).find(
            (n) => n.name === "내컴퓨터",
        );
        expect(vm.myComputerId).toBe(myComputer?.id);
    });

    it("rootId 가 빈 문자열이면 빈 결과를 반환한다", () => {
        const vm = selectStatusBarViewModel({
            rootId: "",
            nodes: {},
            childrenByParent: {},
        });
        expect(vm).toEqual({ projects: [], techStack: [], myComputerId: null });
    });

    it("루트 자식이 전부 exclude 대상이면 projects 는 빈 배열이다", () => {
        const schema: PortfolioSchema = {
            version: 1,
            root: {
                type: "FOLDER",
                name: "root",
                icon: "",
                children: [
                    {
                        type: "INFO",
                        name: "내컴퓨터",
                        icon: "",
                        contents: {
                            name: "",
                            email: "",
                            phone: "",
                            photo: "",
                            summary: "",
                            links: [],
                            details: [],
                        },
                    },
                    {
                        type: "FOLDER",
                        name: "기술스택",
                        icon: "",
                        children: [],
                    },
                ],
            },
        };
        const fs = buildFileSystem(schema);
        const vm = selectStatusBarViewModel(fs);
        expect(vm.projects).toEqual([]);
    });
});

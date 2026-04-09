import { selectFolderViewModel } from "../selectors/selectFolderViewModel";
import { buildFileSystem } from "../buildFileSystem";
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
                        name: "회사A",
                        icon: "",
                        children: [
                            { type: "DOC", name: "문서1", icon: "", contents: {} as any },
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

describe("selectFolderViewModel", () => {
    const fs = buildFileSystem(schema);
    const findByName = (name: string) =>
        Object.values(fs.nodes).find((n) => n.name === name)!;

    it("폴더의 자식 노드를 folderContents로 반환한다", () => {
        const vm = selectFolderViewModel(fs, findByName("프로젝트").id);
        const names = vm.folderContents.map((n) => n.name);
        expect(names).toEqual(["회사A", "빈폴더"]);
    });

    it("nodeType은 해당 폴더의 type이다", () => {
        const vm = selectFolderViewModel(fs, findByName("프로젝트").id);
        expect(vm.nodeType).toBe("FOLDER");
    });

    it("route를 올바르게 계산한다", () => {
        const vm = selectFolderViewModel(fs, findByName("회사A").id);
        expect(vm.route).toBe("/ KDH / root / 프로젝트 / 회사A");
    });

    it("parentId를 반환한다", () => {
        const proj = findByName("프로젝트");
        const vm = selectFolderViewModel(fs, proj.id);
        expect(vm.parentId).toBe(fs.rootId);
    });

    it("hasChildren이 자식이 있는 폴더에 대해 true를 반환한다", () => {
        const vm = selectFolderViewModel(fs, findByName("프로젝트").id);
        expect(vm.hasChildren(findByName("회사A").id)).toBe(true);
    });

    it("hasChildren이 빈 폴더에 대해 false를 반환한다", () => {
        const vm = selectFolderViewModel(fs, findByName("프로젝트").id);
        expect(vm.hasChildren(findByName("빈폴더").id)).toBe(false);
    });

    it("빈 폴더의 folderContents는 빈 배열이다", () => {
        const vm = selectFolderViewModel(fs, findByName("빈폴더").id);
        expect(vm.folderContents).toEqual([]);
    });

    it("존재하지 않는 id에 대해 기본값을 반환한다", () => {
        const vm = selectFolderViewModel(fs, "unknown-id");
        expect(vm.nodeType).toBe("FOLDER");
        expect(vm.folderContents).toEqual([]);
        expect(vm.route).toBe("");
        expect(vm.parentId).toBeNull();
    });
});

import { selectDesktopRootIcons } from "../selectors/selectDesktopRootIcons";
import { buildFileSystem } from "../buildFileSystem";
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

describe("selectDesktopRootIcons", () => {
    const fs = buildFileSystem(schema);

    it("루트 폴더의 자식 노드들을 반환한다", () => {
        const icons = selectDesktopRootIcons(fs);
        const names = icons.map((n) => n.name);
        expect(names).toEqual(["프로젝트", "기술스택", "구글"]);
    });

    it("반환된 노드들의 parentId는 rootId이다", () => {
        const icons = selectDesktopRootIcons(fs);
        icons.forEach((icon) => {
            expect(icon.parentId).toBe(fs.rootId);
        });
    });

    it("rootId가 빈 문자열이면 빈 배열을 반환한다", () => {
        const emptyFs = { rootId: "", nodes: {}, childrenByParent: {} };
        expect(selectDesktopRootIcons(emptyFs)).toEqual([]);
    });

    it("루트에 자식이 없으면 빈 배열을 반환한다", () => {
        const noChildrenSchema: PortfolioSchema = {
            version: 1,
            root: {
                type: "FOLDER",
                name: "root",
                icon: "",
                children: [],
            },
        };
        const noChildrenFs = buildFileSystem(noChildrenSchema);
        expect(selectDesktopRootIcons(noChildrenFs)).toEqual([]);
    });
});

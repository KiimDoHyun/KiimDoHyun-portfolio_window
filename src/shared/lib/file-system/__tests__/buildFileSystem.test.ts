import { buildFileSystem } from "../buildFileSystem";
import type { PortfolioSchema } from "@shared/types/portfolio-schema";

const schema: PortfolioSchema = {
    version: 1,
    root: {
        type: "FOLDER",
        name: "root",
        icon: "root.png",
        children: [
            {
                type: "FOLDER",
                name: "projects",
                icon: "folder.png",
                children: [
                    { type: "BROWSER", name: "github", icon: "gh.png", url: "https://github.com" },
                ],
            },
            { type: "IMAGE", name: "selfie", icon: "img.png", src: "/me.png" },
        ],
    },
};

describe("buildFileSystem", () => {
    it("creates a normalized state with a root id", () => {
        const state = buildFileSystem(schema);
        expect(state.rootId).toBeDefined();
        expect(state.nodes[state.rootId]).toBeDefined();
        expect(state.nodes[state.rootId].type).toBe("FOLDER");
        expect(state.nodes[state.rootId].parentId).toBeNull();
    });

    it("indexes children under their parent in declared order", () => {
        const state = buildFileSystem(schema);
        const rootChildren = state.childrenByParent[state.rootId];
        expect(rootChildren).toHaveLength(2);
        expect(state.nodes[rootChildren[0]].name).toBe("projects");
        expect(state.nodes[rootChildren[1]].name).toBe("selfie");
    });

    it("recursively flattens nested folders", () => {
        const state = buildFileSystem(schema);
        const projectsId = state.childrenByParent[state.rootId][0];
        const projectsChildren = state.childrenByParent[projectsId];
        expect(projectsChildren).toHaveLength(1);
        const githubNode = state.nodes[projectsChildren[0]];
        expect(githubNode.type).toBe("BROWSER");
        if (githubNode.type === "BROWSER") {
            expect(githubNode.url).toBe("https://github.com");
        }
    });

    it("assigns unique ids to every node", () => {
        const state = buildFileSystem(schema);
        const ids = Object.keys(state.nodes);
        expect(new Set(ids).size).toBe(ids.length);
        expect(ids).toHaveLength(4); // root + projects + github + selfie
    });

    it("sets parentId correctly on nested nodes", () => {
        const state = buildFileSystem(schema);
        const projectsId = state.childrenByParent[state.rootId][0];
        expect(state.nodes[projectsId].parentId).toBe(state.rootId);
        const githubId = state.childrenByParent[projectsId][0];
        expect(state.nodes[githubId].parentId).toBe(projectsId);
    });
});

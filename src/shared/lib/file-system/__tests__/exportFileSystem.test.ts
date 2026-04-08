import { buildFileSystem } from "../buildFileSystem";
import { exportFileSystem } from "../exportFileSystem";
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

describe("exportFileSystem", () => {
    it("round-trips: export(build(schema)) deeply equals schema", () => {
        const state = buildFileSystem(schema);
        const exported = exportFileSystem(state);
        expect(exported).toEqual(schema);
    });

    it("preserves child order", () => {
        const state = buildFileSystem(schema);
        const exported = exportFileSystem(state);
        if (exported.root.type !== "FOLDER") throw new Error("expected FOLDER");
        expect(exported.root.children.map((c) => c.name)).toEqual(["projects", "selfie"]);
    });

    it("does not leak ids into the output", () => {
        const state = buildFileSystem(schema);
        const exported = exportFileSystem(state);
        const json = JSON.stringify(exported);
        expect(json).not.toContain("node_");
        expect(json).not.toContain('"id"');
        expect(json).not.toContain("parentId");
    });
});

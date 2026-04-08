import { getRoute } from "../getRoute";
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
                        name: "(주)아라온소프트",
                        icon: "",
                        children: [
                            { type: "DOC", name: "LHWS", icon: "", contents: {} as any },
                        ],
                    },
                ],
            },
        ],
    },
};

describe("getRoute", () => {
    const state = buildFileSystem(schema);
    const rootId = state.rootId;
    const findByName = (name: string) =>
        Object.values(state.nodes).find((n) => n.name === name)!;

    it("returns '/ KDH / root' for the root node", () => {
        expect(getRoute(state, rootId)).toBe("/ KDH / root");
    });

    it("joins ancestor names with ' / ' for nested nodes", () => {
        const lhws = findByName("LHWS");
        expect(getRoute(state, lhws.id)).toBe(
            "/ KDH / root / 프로젝트 / (주)아라온소프트 / LHWS"
        );
    });

    it("returns '' for an unknown id", () => {
        expect(getRoute(state, "does-not-exist")).toBe("");
    });
});

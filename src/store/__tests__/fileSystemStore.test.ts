import { useFileSystemStore } from "../fileSystemStore";
import type { PortfolioSchema } from "@shared/types/portfolio-schema";

const schema: PortfolioSchema = {
    version: 1,
    root: {
        type: "FOLDER",
        name: "root",
        icon: "root.png",
        children: [
            { type: "BROWSER", name: "gh", icon: "gh.png", url: "https://github.com" },
        ],
    },
};

describe("fileSystemStore", () => {
    beforeEach(() => {
        useFileSystemStore.setState({ rootId: "", nodes: {}, childrenByParent: {} });
    });

    it("hydrate populates state from a schema", () => {
        useFileSystemStore.getState().hydrate(schema);
        const state = useFileSystemStore.getState();
        expect(state.rootId).toBeTruthy();
        expect(Object.keys(state.nodes)).toHaveLength(2);
    });

    it("export returns a schema deeply equal to the original", () => {
        useFileSystemStore.getState().hydrate(schema);
        const exported = useFileSystemStore.getState().exportSchema();
        expect(exported).toEqual(schema);
    });

    it("addNode appends a child under the given parent", () => {
        useFileSystemStore.getState().hydrate(schema);
        const rootId = useFileSystemStore.getState().rootId;
        const newId = useFileSystemStore.getState().addNode(rootId, {
            type: "IMAGE",
            name: "new",
            icon: "i.png",
            src: "/x.png",
        });
        const state = useFileSystemStore.getState();
        expect(state.nodes[newId]).toBeDefined();
        expect(state.nodes[newId].parentId).toBe(rootId);
        expect(state.childrenByParent[rootId]).toContain(newId);
    });

    it("renameNode changes only the name", () => {
        useFileSystemStore.getState().hydrate(schema);
        const rootId = useFileSystemStore.getState().rootId;
        const childId = useFileSystemStore.getState().childrenByParent[rootId][0];
        useFileSystemStore.getState().renameNode(childId, "renamed");
        expect(useFileSystemStore.getState().nodes[childId].name).toBe("renamed");
    });

    it("deleteNode removes the node and its descendants", () => {
        useFileSystemStore.getState().hydrate(schema);
        const rootId = useFileSystemStore.getState().rootId;
        const childId = useFileSystemStore.getState().childrenByParent[rootId][0];
        useFileSystemStore.getState().deleteNode(childId);
        const state = useFileSystemStore.getState();
        expect(state.nodes[childId]).toBeUndefined();
        expect(state.childrenByParent[rootId]).not.toContain(childId);
    });

    it("moveNode reparents and updates indices", () => {
        const nestedSchema: PortfolioSchema = {
            version: 1,
            root: {
                type: "FOLDER",
                name: "root",
                icon: "r.png",
                children: [
                    { type: "FOLDER", name: "a", icon: "a.png", children: [] },
                    { type: "FOLDER", name: "b", icon: "b.png", children: [
                        { type: "IMAGE", name: "img", icon: "i.png", src: "/i.png" },
                    ] },
                ],
            },
        };
        useFileSystemStore.getState().hydrate(nestedSchema);
        const rootId = useFileSystemStore.getState().rootId;
        const aId = useFileSystemStore.getState().childrenByParent[rootId][0];
        const bId = useFileSystemStore.getState().childrenByParent[rootId][1];
        const imgId = useFileSystemStore.getState().childrenByParent[bId][0];

        useFileSystemStore.getState().moveNode(imgId, aId);

        const state = useFileSystemStore.getState();
        expect(state.nodes[imgId].parentId).toBe(aId);
        expect(state.childrenByParent[aId]).toContain(imgId);
        expect(state.childrenByParent[bId]).not.toContain(imgId);
    });
});

import { useRunningProgramsStore } from "../runningProgramsStore";

describe("runningProgramsStore", () => {
    beforeEach(() => {
        useRunningProgramsStore.setState({
            byId: {},
            order: [],
            activeId: null,
            zIndexCounter: 1,
        });
    });

    it("open() adds a new running program with status 'active' and sets activeId", () => {
        useRunningProgramsStore.getState().open("n1");
        const s = useRunningProgramsStore.getState();
        expect(s.byId["n1"]).toMatchObject({ id: "n1", status: "active" });
        expect(s.order).toEqual(["n1"]);
        expect(s.activeId).toBe("n1");
        expect(s.zIndexCounter).toBe(2);
        expect(s.byId["n1"].zIndex).toBe(2);
    });

    it("open() on an already-open minimized program restores it and increments zIndex", () => {
        const { open, minimize } = useRunningProgramsStore.getState();
        open("n1");
        minimize("n1");
        open("n1");
        const s = useRunningProgramsStore.getState();
        expect(s.byId["n1"].status).toBe("active");
        expect(s.activeId).toBe("n1");
        expect(s.order).toEqual(["n1"]);
        expect(s.zIndexCounter).toBe(3);
    });

    it("activate() changes activeId and bumps zIndex for that program only", () => {
        const { open, activate } = useRunningProgramsStore.getState();
        open("n1");
        open("n2");
        const prevCounter = useRunningProgramsStore.getState().zIndexCounter;
        activate("n1");
        const s = useRunningProgramsStore.getState();
        expect(s.activeId).toBe("n1");
        expect(s.byId["n1"].zIndex).toBe(prevCounter + 1);
        expect(s.zIndexCounter).toBe(prevCounter + 1);
    });

    it("minimize() sets status='min' and clears activeId if it was active", () => {
        const { open, minimize } = useRunningProgramsStore.getState();
        open("n1");
        minimize("n1");
        const s = useRunningProgramsStore.getState();
        expect(s.byId["n1"].status).toBe("min");
        expect(s.activeId).toBeNull();
    });

    it("close() removes the program from byId and order", () => {
        const { open, close } = useRunningProgramsStore.getState();
        open("n1");
        open("n2");
        close("n1");
        const s = useRunningProgramsStore.getState();
        expect(s.byId["n1"]).toBeUndefined();
        expect(s.order).toEqual(["n2"]);
    });

    it("close() on the currently active program clears activeId", () => {
        const { open, close } = useRunningProgramsStore.getState();
        open("n1");
        close("n1");
        expect(useRunningProgramsStore.getState().activeId).toBeNull();
    });

    it("closeAll() sets every program's status to 'min' and clears activeId", () => {
        const { open, closeAll } = useRunningProgramsStore.getState();
        open("n1");
        open("n2");
        closeAll();
        const s = useRunningProgramsStore.getState();
        expect(s.byId["n1"].status).toBe("min");
        expect(s.byId["n2"].status).toBe("min");
        expect(s.activeId).toBeNull();
    });

    it("toggleFromTaskbar(): minimized → active; active and is activeId → minimize; active and not activeId → activate", () => {
        const { open, minimize, toggleFromTaskbar } =
            useRunningProgramsStore.getState();
        open("n1");
        open("n2");
        toggleFromTaskbar("n2");
        expect(useRunningProgramsStore.getState().byId["n2"].status).toBe("min");
        expect(useRunningProgramsStore.getState().activeId).toBeNull();
        toggleFromTaskbar("n2");
        expect(useRunningProgramsStore.getState().byId["n2"].status).toBe("active");
        expect(useRunningProgramsStore.getState().activeId).toBe("n2");
        minimize("n2");
        useRunningProgramsStore.setState((draft) => {
            draft.byId["n1"].status = "active";
        });
        toggleFromTaskbar("n1");
        expect(useRunningProgramsStore.getState().activeId).toBe("n1");
    });

    it("requestZIndex() increments and returns the new counter", () => {
        const next = useRunningProgramsStore.getState().requestZIndex();
        expect(next).toBe(2);
        expect(useRunningProgramsStore.getState().zIndexCounter).toBe(2);
    });
});

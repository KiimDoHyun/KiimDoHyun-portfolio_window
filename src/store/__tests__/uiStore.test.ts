import { useUiStore } from "../uiStore";

const INITIAL = {
    statusBarOpen: false,
    timeBarOpen: false,
    infoBarOpen: false,
    hiddenIconOpen: false,
    previewActive: false,
    displayLight: 100,
};

describe("uiStore", () => {
    beforeEach(() => {
        useUiStore.setState({ ...INITIAL });
    });

    it("toggleStatusBar() toggles statusBar and closes the other three menus", () => {
        useUiStore.setState({
            timeBarOpen: true,
            infoBarOpen: true,
            hiddenIconOpen: true,
        });
        useUiStore.getState().toggleStatusBar();
        const s = useUiStore.getState();
        expect(s.statusBarOpen).toBe(true);
        expect(s.timeBarOpen).toBe(false);
        expect(s.infoBarOpen).toBe(false);
        expect(s.hiddenIconOpen).toBe(false);
    });

    it("toggleTimeBar() toggles timeBar and closes the other three menus", () => {
        useUiStore.getState().toggleTimeBar();
        expect(useUiStore.getState().timeBarOpen).toBe(true);
        useUiStore.getState().toggleTimeBar();
        expect(useUiStore.getState().timeBarOpen).toBe(false);
    });

    it("toggleInfoBar() and toggleHiddenIcon() behave symmetrically", () => {
        useUiStore.getState().toggleInfoBar();
        expect(useUiStore.getState().infoBarOpen).toBe(true);
        expect(useUiStore.getState().hiddenIconOpen).toBe(false);
        useUiStore.getState().toggleHiddenIcon();
        expect(useUiStore.getState().hiddenIconOpen).toBe(true);
        expect(useUiStore.getState().infoBarOpen).toBe(false);
    });

    it("closeAllMenus() sets all four menus false but leaves previewActive/displayLight alone", () => {
        useUiStore.setState({
            statusBarOpen: true,
            timeBarOpen: true,
            infoBarOpen: true,
            hiddenIconOpen: true,
            previewActive: true,
            displayLight: 42,
        });
        useUiStore.getState().closeAllMenus();
        const s = useUiStore.getState();
        expect(s.statusBarOpen).toBe(false);
        expect(s.timeBarOpen).toBe(false);
        expect(s.infoBarOpen).toBe(false);
        expect(s.hiddenIconOpen).toBe(false);
        expect(s.previewActive).toBe(true);
        expect(s.displayLight).toBe(42);
    });

    it("setPreviewActive() and setDisplayLight() update their fields", () => {
        useUiStore.getState().setPreviewActive(true);
        expect(useUiStore.getState().previewActive).toBe(true);
        useUiStore.getState().setDisplayLight(50);
        expect(useUiStore.getState().displayLight).toBe(50);
    });
});

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// Recoil 0.7.7는 React 19와 호환되지 않으므로(내부 API 접근 문제),
// 컨테이너 동작 자체를 검증하기 위해 recoil 모듈을 가볍게 모킹한다.
// RecoilRoot는 패스스루로 두고, useRecoilValue는 atom의 key를 보고
// 미리 시드한 값을 반환한다.
jest.mock("recoil", () => {
    const React = require("react");
    return {
        atom: (cfg: any) => ({ key: cfg.key, default: cfg.default }),
        useRecoilValue: (atomLike: any) => {
            const store = (global as any).__recoilTestStore || {};
            if (atomLike?.key in store) return store[atomLike.key];
            return atomLike?.default;
        },
        useRecoilState: (atomLike: any) => {
            const store = (global as any).__recoilTestStore || {};
            const value = atomLike?.key in store ? store[atomLike.key] : atomLike?.default;
            return [value, () => undefined];
        },
        useSetRecoilState: () => () => undefined,
        useRecoilCallback: (fn: any) => fn({ snapshot: {}, set: () => undefined }),
        RecoilRoot: ({ children }: { children: React.ReactNode }) => children,
        selector: (cfg: any) => ({ key: cfg.key }),
    };
});

import {
    rc_global_Directory_List,
    rc_global_Directory_Tree,
} from "@store/global";
import FolderProgramContainer from "../FolderProgramContainer";

const mockDirectory = [
    {
        name: "프로젝트",
        type: "FOLDER",
        icon: "",
        parent: "root",
        route: "/ KDH / 프로젝트",
    },
    {
        name: "(주)아라온소프트",
        type: "FOLDER",
        icon: "",
        parent: "프로젝트",
        route: "/ KDH / 프로젝트 / (주)아라온소프트",
    },
    {
        name: "빈폴더",
        type: "FOLDER",
        icon: "",
        parent: "root",
        route: "/ KDH / 빈폴더",
    },
];

const mockTree: Record<string, Array<any>> = {
    프로젝트: [
        {
            name: "(주)아라온소프트",
            type: "FOLDER",
            icon: "",
            parent: "프로젝트",
        },
    ],
    "(주)아라온소프트": [
        {
            name: "샘플DOC",
            type: "DOC",
            icon: "",
            parent: "(주)아라온소프트",
        },
    ],
};

const renderWithRecoil = (ui: React.ReactElement) => {
    (global as any).__recoilTestStore = {
        [(rc_global_Directory_List as any).key]: mockDirectory,
        [(rc_global_Directory_Tree as any).key]: mockTree,
    };
    return render(ui);
};

describe("FolderProgramContainer (characterization)", () => {
    it("초기 폴더의 자식 항목들을 렌더한다", () => {
        renderWithRecoil(<FolderProgramContainer name="프로젝트" type="FOLDER" />);
        expect(screen.getByText("(주)아라온소프트")).toBeInTheDocument();
    });

    it("아이템 클릭 시 selected 상태가 된다", () => {
        renderWithRecoil(
            <FolderProgramContainer name="프로젝트" type="FOLDER" />
        );
        const itemNameDiv = screen.getByText("(주)아라온소프트");
        const folderEl = itemNameDiv.closest(".folder");
        expect(folderEl).not.toBeNull();
        fireEvent.click(folderEl!);
        expect(folderEl).toHaveClass("folder_selected");
    });

    it("폴더 더블클릭 시 해당 폴더로 진입한다", () => {
        renderWithRecoil(<FolderProgramContainer name="프로젝트" type="FOLDER" />);
        const folderEl = screen.getByText("(주)아라온소프트").closest(".folder");
        fireEvent.doubleClick(folderEl!);
        expect(screen.getByText("샘플DOC")).toBeInTheDocument();
    });

    it("뒤로가기 클릭 시 부모 폴더로 이동한다", () => {
        renderWithRecoil(
            <FolderProgramContainer name="(주)아라온소프트" type="FOLDER" />
        );
        // 시작: 샘플DOC 표시
        expect(screen.getByText("샘플DOC")).toBeInTheDocument();
        const back = screen.getByAltText("leftArrow");
        fireEvent.click(back);
        // 부모인 프로젝트의 자식 = (주)아라온소프트
        expect(screen.getByText("(주)아라온소프트")).toBeInTheDocument();
    });

    it("표시 방식 select 변경 시 className이 갱신된다", () => {
        const { container } = renderWithRecoil(
            <FolderProgramContainer name="프로젝트" type="FOLDER" />
        );
        const select = container.querySelector("select");
        expect(select).not.toBeNull();
        fireEvent.change(select!, { target: { value: "BIG_ICON" } });
        expect(
            container.querySelector(".BIG_ICON.contentsArea_folder")
        ).not.toBeNull();
    });

    it("빈 폴더는 '비어있습니다.'를 표시한다", () => {
        renderWithRecoil(<FolderProgramContainer name="빈폴더" type="FOLDER" />);
        expect(screen.getByText("비어있습니다.")).toBeInTheDocument();
    });
});

import type { ReactNode } from "react";
import type { WindowShellItem } from "@features/window-shell";
import { ImageProgram } from "@features/program-image";
import { FolderProgram } from "@features/program-folder";
import { DOCProgram } from "@features/program-doc";
import InfoProgram from "@features/program-info/InfoProgram";
import { useFileSystemStore } from "@store/fileSystemStore";

// name → id 조회 (Task 14에서 renderProgramContent 전체를 ProgramNode 기반으로 바꾸면 제거)
function findIdByName(name: string): string | null {
    const nodes = useFileSystemStore.getState().nodes;
    for (const id of Object.keys(nodes)) {
        if (nodes[id].name === name) return id;
    }
    return null;
}

/**
 * programList 항목 하나에 대한 content 영역(헤더 제외)을 렌더한다.
 * WindowShell 내부 본문과 Taskbar 미리보기 팝업 양쪽에서 사용한다.
 */
export const renderProgramContent = (item: WindowShellItem): ReactNode => {
    switch (item.type) {
        case "BROWSER":
            return (
                <div className="contentsArea_Cover">
                    <iframe
                        src="https://www.google.com/webhp?igu=1"
                        title="Google"
                        width="100%"
                        height="100%"
                    />
                </div>
            );
        case "FOLDER": {
            const id = findIdByName(item.name);
            return id ? <FolderProgram id={id} /> : null;
        }
        case "IMAGE": {
            const id = findIdByName(item.name);
            return id ? <ImageProgram id={id} /> : null;
        }
        case "DOC":
            return <DOCProgram type={item.type} name={item.name} />;
        case "INFO":
            return <InfoProgram type={item.type} />;
        default:
            return null;
    }
};

import type { ReactNode } from "react";
import type { ProgramNode } from "@shared/types/program";
import { programShells } from "./programShells";

/**
 * 한 프로그램 노드에 대한 content 영역(헤더 제외)을 렌더한다.
 * WindowShell 내부 본문과 Taskbar 미리보기 팝업 양쪽에서 사용한다.
 */
export const renderProgramContent = (node: ProgramNode): ReactNode => {
    if (node.type === "BROWSER") {
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
    }

    const Shell = programShells[node.type];
    return Shell ? <Shell id={node.id} /> : null;
};

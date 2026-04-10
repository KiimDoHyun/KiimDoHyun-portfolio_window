import type { ProgramType } from "@shared/types/program";
import folderEmpty from "@images/icons/folder_empty.png";
import defaultImage from "@images/icons/image_default.png";
import defaultDocumentImage from "@images/icons/document_default.png";
import monitor from "@images/icons/monitor.png";

export interface ProgramMetaEntry {
    /** type별 fallback 아이콘 (매니페스트 키에 없을 때) */
    defaultIcon: string;

    /** 윈도우 타이틀 resolve (기본: node.name) */
    resolveTitle?: (name: string) => string;

    /** 윈도우 subHeader 존재 여부 */
    hasSubHeader?: boolean;

    /** AuthoringNode ↔ ProgramNode 변환 시 추가 필드 키 목록 */
    extraFields: Array<string>;
}

/**
 * registry의 extraFields를 사용하여 소스 객체에서 동적 필드를 추출한다.
 * buildFileSystem, exportFileSystem, fileSystemStore의 중복 로직을 통합.
 */
export function pickExtraFields(
    type: ProgramType,
    source: Record<string, unknown>,
): Record<string, unknown> {
    const extra: Record<string, unknown> = {};
    for (const key of programMeta[type].extraFields) {
        extra[key] = source[key];
    }
    return extra;
}

export const programMeta: Record<ProgramType, ProgramMetaEntry> = {
    FOLDER: {
        defaultIcon: folderEmpty,
        extraFields: [],
    },
    DOC: {
        defaultIcon: defaultDocumentImage,
        extraFields: ["contents"],
    },
    IMAGE: {
        defaultIcon: defaultImage,
        resolveTitle: (_name) => "이미지",
        extraFields: ["src"],
    },
    INFO: {
        defaultIcon: monitor,
        extraFields: ["contents"],
    },
    BROWSER: {
        defaultIcon: folderEmpty,
        hasSubHeader: true,
        extraFields: ["url"],
    },
};

import folderFull from "@images/icons/folder_full.png";
import folderEmpty from "@images/icons/folder_empty.png";
import defaultImage from "@images/icons/image_default.png";
import { contentStyle } from "../FolderProgram.style";
import { useFileSystemStore } from "@store/fileSystemStore";
import type { ProgramId, ProgramNode } from "@shared/types/program";

interface FolderGridProps {
    items: Array<ProgramNode>;
    displayType: string;
    selectedId: ProgramId | null;
    onClickItem: (id: ProgramId) => void;
    onDoubleClickItem: (item: ProgramNode) => void;
}

function nodeIcon(node: ProgramNode): string {
    return (node as unknown as { icon?: string }).icon ?? "";
}

const FolderGrid = ({
    items,
    displayType,
    selectedId,
    onClickItem,
    onDoubleClickItem,
}: FolderGridProps) => {
    const childrenByParent = useFileSystemStore((s) => s.childrenByParent);
    const hasChildren = (id: ProgramId) =>
        (childrenByParent[id] ?? []).length > 0;

    return (
        <div className={`contentsArea_Cover ${contentStyle}`}>
            <div className="sideFolderArea"></div>
            <div className={`${displayType} contentsArea_folder`}>
                {items && items.length > 0 ? (
                    <>
                        {displayType === "DETAIL" && (
                            <div className="detailHeader">
                                <div className="name">이미지</div>
                                <div className="name">이름</div>
                                <div className="name">유형</div>
                            </div>
                        )}
                        {items.map((item) => (
                            <div
                                className={
                                    selectedId === item.id
                                        ? "folder folder_selected"
                                        : "folder"
                                }
                                key={item.id}
                                onClick={() => onClickItem(item.id)}
                                onDoubleClick={() => onDoubleClickItem(item)}
                            >
                                <div className="imgCover">
                                    {item.type === "FOLDER" ? (
                                        <img
                                            src={
                                                hasChildren(item.id)
                                                    ? folderFull
                                                    : folderEmpty
                                            }
                                            alt="folderEmpty"
                                        />
                                    ) : (
                                        <img
                                            src={nodeIcon(item) || defaultImage}
                                            alt={item.name}
                                        />
                                    )}
                                </div>
                                <div className="name">{item.name}</div>
                                {displayType === "DETAIL" && (
                                    <div className="name">{item.type}</div>
                                )}
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="noContents">비어있습니다.</div>
                )}
            </div>
        </div>
    );
};

export default FolderGrid;

import folderFull from "@images/icons/folder_full.png";
import folderEmpty from "@images/icons/folder_empty.png";
import defaultImage from "@images/icons/image_default.png";
import { contentStyle } from "../FolderProgram.style";
import type { ProgramId, ProgramNode } from "@shared/types/program";
import { resolveAsset } from "@shared/lib/assetManifest";

interface FolderGridProps {
    items: Array<ProgramNode>;
    displayType: string;
    selectedId: ProgramId | null;
    hasChildren: (id: ProgramId) => boolean;
    onClickItem: (id: ProgramId) => void;
    onDoubleClickItem: (item: ProgramNode) => void;
}

const FolderGrid = ({
    items,
    displayType,
    selectedId,
    hasChildren,
    onClickItem,
    onDoubleClickItem,
}: FolderGridProps) => {

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
                                            src={resolveAsset(item.icon) ?? defaultImage}
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

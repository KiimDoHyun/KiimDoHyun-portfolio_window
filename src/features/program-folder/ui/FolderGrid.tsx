import folderFull from "@images/icons/folder_full.png";
import folderEmpty from "@images/icons/folder_empty.png";
import defaultImage from "@images/icons/image_default.png";
import { contentStyle } from "../FolderProgram.style";
import type {
    DirectoryItem,
    DirectoryTree,
} from "@pages/DesktopPage/DesktopDataContext";

interface FolderGridProps {
    items: Array<DirectoryItem>;
    directoryTree: DirectoryTree;
    displayType: string;
    selectedItem: string;
    onClickItem: (name: string) => void;
    onDoubleClickItem: (item: DirectoryItem) => void;
}

const FolderGrid = ({
    items,
    directoryTree,
    displayType,
    selectedItem,
    onClickItem,
    onDoubleClickItem,
}: FolderGridProps) => (
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
                    {items.map((item, idx) => (
                        <div
                            className={
                                selectedItem === item.name
                                    ? "folder folder_selected"
                                    : "folder"
                            }
                            key={idx}
                            onClick={() => onClickItem(item.name)}
                            onDoubleClick={() => onDoubleClickItem(item)}
                        >
                            <div className="imgCover">
                                {item.type === "FOLDER" ? (
                                    <img
                                        src={
                                            directoryTree[item.name] &&
                                            directoryTree[item.name].length > 0
                                                ? folderFull
                                                : folderEmpty
                                        }
                                        alt="folderEmpty"
                                    />
                                ) : (
                                    <img
                                        src={item.icon || defaultImage}
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

export default FolderGrid;

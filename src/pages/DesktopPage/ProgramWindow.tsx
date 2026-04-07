import folderEmpty from "@images/icons/folder_empty.png";
import defaultImage from "@images/icons/image_default.png";
import monitor from "@images/icons/monitor.png";
import defaultDocumentImage from "@images/icons/document_default.png";

import { WindowShell } from "@features/window-shell";
import type { WindowShellItem } from "@features/window-shell";
import { renderProgramContent } from "./renderProgramContent";

interface ProgramWindowProps {
  item: WindowShellItem;
  activeProgram: string;
  onActivate: (name: string) => void;
  onMinimize: (name: string) => void;
  onClose: (name: string) => void;
  onRequestZIndex: () => number;
}

const resolveTitle = (item: WindowShellItem): string => {
  if (item.type === "IMAGE") return "이미지";
  return item.name;
};

const resolveIcon = (item: WindowShellItem): string => {
  switch (item.type) {
    case "IMAGE":
      return defaultImage;
    case "DOC":
      return defaultDocumentImage;
    case "INFO":
      return monitor;
    default:
      return item.icon || folderEmpty;
  }
};

const ProgramWindow = ({
  item,
  activeProgram,
  onActivate,
  onMinimize,
  onClose,
  onRequestZIndex,
}: ProgramWindowProps) => {
  const subHeader =
    item.type === "BROWSER" ? (
      <div className={`headerArea2 headerArea2_${item.type}`} />
    ) : undefined;

  return (
    <WindowShell
      item={item}
      title={resolveTitle(item)}
      iconSrc={resolveIcon(item)}
      activeProgram={activeProgram}
      subHeader={subHeader}
      onActivate={onActivate}
      onMinimize={onMinimize}
      onClose={onClose}
      onRequestZIndex={onRequestZIndex}
    >
      {renderProgramContent(item)}
    </WindowShell>
  );
};

export default ProgramWindow;

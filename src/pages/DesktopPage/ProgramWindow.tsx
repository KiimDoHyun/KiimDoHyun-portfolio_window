import { WindowShell } from "@features/window-shell";
import type { WindowShellItem } from "@features/window-shell";
import { renderProgramContent } from "./renderProgramContent";
import { resolveProgramTitle, resolveProgramIcon } from "./resolveProgramMeta";

interface ProgramWindowProps {
  item: WindowShellItem;
  activeProgram: string;
  onActivate: (name: string) => void;
  onMinimize: (name: string) => void;
  onClose: (name: string) => void;
  onRequestZIndex: () => number;
}

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
      title={resolveProgramTitle(item)}
      iconSrc={resolveProgramIcon(item)}
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

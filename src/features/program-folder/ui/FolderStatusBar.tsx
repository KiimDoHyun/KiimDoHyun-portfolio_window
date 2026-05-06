interface FolderStatusBarProps {
    totalCount: number;
    selectedCount: number;
}

const FolderStatusBar = ({
    totalCount,
    selectedCount,
}: FolderStatusBarProps) => (
    <div className="bottomArea">
        <span>{totalCount}개 항목</span>
        {selectedCount > 0 && <span>{selectedCount}개 항목 선택함</span>}
    </div>
);

export default FolderStatusBar;

interface WindowResizeHandlesProps {
  onResizeMouseDown: (e: React.MouseEvent) => void;
  onResizeMouseUp: () => void;
}

const WindowResizeHandles = ({
  onResizeMouseDown,
  onResizeMouseUp,
}: WindowResizeHandlesProps) => {
  return (
    <>
      <div className="modiSize top_left" />
      <div className="modiSize top_right" />
      <div className="modiSize right" />
      <div className="modiSize bottom_left" />
      <div
        className="modiSize bottom_right"
        onMouseDown={onResizeMouseDown}
        onMouseUp={onResizeMouseUp}
      />
    </>
  );
};

export default WindowResizeHandles;

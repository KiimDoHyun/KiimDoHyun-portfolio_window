interface WindowResizeHandlesProps {
  onResizeMouseDown: (e: React.MouseEvent) => void;
}

const WindowResizeHandles = ({
  onResizeMouseDown,
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
      />
    </>
  );
};

export default WindowResizeHandles;

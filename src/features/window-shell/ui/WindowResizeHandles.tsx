import type { ResizeDirection } from "../lib/geometry";

interface WindowResizeHandlesProps {
    onResizeMouseDown: (
        direction: ResizeDirection
    ) => (e: React.MouseEvent) => void;
}

const DIRECTIONS: { dir: ResizeDirection; className: string }[] = [
    { dir: "top", className: "top" },
    { dir: "right", className: "right" },
    { dir: "bottom", className: "bottom" },
    { dir: "left", className: "left" },
    { dir: "top-left", className: "top_left" },
    { dir: "top-right", className: "top_right" },
    { dir: "bottom-left", className: "bottom_left" },
    { dir: "bottom-right", className: "bottom_right" },
];

const WindowResizeHandles = ({ onResizeMouseDown }: WindowResizeHandlesProps) => {
    return (
        <>
            {DIRECTIONS.map(({ dir, className }) => (
                <div
                    key={dir}
                    className={`modiSize ${className}`}
                    onMouseDown={onResizeMouseDown(dir)}
                />
            ))}
        </>
    );
};

export default WindowResizeHandles;

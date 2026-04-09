import { useMemo } from "react";
import { useFileSystemStore } from "@store/fileSystemStore";
import { ImageProgram } from "@features/program-image";
import type { ProgramId, ProgramNode } from "@shared/types/program";

interface ImageProgramShellProps {
    id: ProgramId;
}

const ImageProgramShell = ({ id }: ImageProgramShellProps) => {
    const nodes = useFileSystemStore((s) => s.nodes);
    const childrenByParent = useFileSystemStore((s) => s.childrenByParent);
    const self = nodes[id];
    const parentId = self?.parentId ?? null;

    const siblingImages = useMemo<Array<ProgramNode>>(() => {
        if (!parentId) return [];
        return (childrenByParent[parentId] ?? [])
            .map((cid) => nodes[cid])
            .filter((n): n is ProgramNode => !!n && n.type === "IMAGE");
    }, [childrenByParent, nodes, parentId]);

    if (!self || self.type !== "IMAGE") return null;

    return <ImageProgram images={siblingImages} currentId={id} />;
};

export default ImageProgramShell;

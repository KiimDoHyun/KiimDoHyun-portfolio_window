import folderEmpty from "@images/icons/folder_empty.png";
import defaultImage from "@images/icons/image_default.png";
import monitor from "@images/icons/monitor.png";
import defaultDocumentImage from "@images/icons/document_default.png";

interface ProgramMetaInput {
  name: string;
  type: string;
  icon?: string;
}

export const resolveProgramTitle = (item: ProgramMetaInput): string => {
  if (item.type === "IMAGE") return "이미지";
  return item.name;
};

export const resolveProgramIcon = (item: ProgramMetaInput): string => {
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

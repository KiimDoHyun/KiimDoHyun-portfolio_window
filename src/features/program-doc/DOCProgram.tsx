import Markdown from "react-markdown";
import type { ProjectData } from "@shared/types/content";
import { docProgramContentStyle } from "./DOCProgram.style";

type DOCProgramProps = {
    contents: ProjectData;
};

const DOCProgram = ({ contents }: DOCProgramProps) => {
    return (
        <>
            <div className="headerArea2 headerArea2_DOC"></div>
            <div className={`${docProgramContentStyle} contentsArea_Cover`}>
                <div className="doc_header">
                    <span className="doc_projectName">{contents.projectName}</span>
                    {contents.projectTerm && (
                        <span className="doc_projectTerm">{contents.projectTerm}</span>
                    )}
                </div>
                <div className="doc_body">
                    <Markdown>{contents.projectDesc}</Markdown>
                </div>
            </div>
        </>
    );
};

export default DOCProgram;

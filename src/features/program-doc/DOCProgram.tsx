import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
                {(contents.projectTerm || contents.department) && (
                    <div className="doc_header">
                        {contents.department && (
                            <>
                                <span className="doc_metaLabel">소속</span>
                                <span className="doc_metaValue">{contents.department}</span>
                            </>
                        )}
                        {contents.projectTerm && (
                            <>
                                <span className="doc_metaLabel">기간</span>
                                <span className="doc_metaValue">{contents.projectTerm}</span>
                            </>
                        )}
                    </div>
                )}
                <div className="doc_body">
                    <Markdown remarkPlugins={[remarkGfm]}>{contents.projectDesc}</Markdown>
                </div>
            </div>
        </>
    );
};

export default DOCProgram;

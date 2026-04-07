import { useMemo } from "react";
import { projectDatas } from "@shared/lib/data";
import { docProgramContentStyle } from "./DOCProgram.style";
import type { ProjectData } from "./DOCProgram.types";
import DocCard from "./ui/DocCard";

interface DOCProgramProps {
    type: string;
    name: string;
}

const DOCProgram = ({ type, name }: DOCProgramProps) => {
    const docData = useMemo<ProjectData | null>(() => {
        if (type !== "DOC") return null;
        const target = projectDatas.find(
            (item: ProjectData) => item.projectName === name
        ) as ProjectData | undefined;
        return target ?? null;
    }, [type, name]);

    if (!docData) return null;

    return (
        <>
            <div className={`headerArea2 headerArea2_${type}`}></div>
            <div className={`${docProgramContentStyle} contentsArea_Cover`}>
                <div className="contentsArea_doc">
                    <div className="doc_imageArea">
                        {docData.projectImages && docData.projectImages.length > 0 ? (
                            docData.projectImages.map((imageItem, idx) => (
                                <div key={idx} className="projectImageItem">
                                    <img src={imageItem} alt={`${imageItem}${idx + 1}`} />
                                </div>
                            ))
                        ) : (
                            <div className="noProjectImage">
                                프로젝트 이미지가 없습니다.
                            </div>
                        )}
                    </div>

                    <div className={`${docProgramContentStyle} doc_contentsArea`}>
                        <DocCard title="프로젝트 명">{docData.projectName}</DocCard>
                        <DocCard title="프로젝트 설명">{docData.projectDesc}</DocCard>

                        <div className="doc_card">
                            <div className="cardTitle">프로젝트 성과</div>
                            <div className="cardContent doc_reulst">
                                {docData.projectReulst &&
                                    docData.projectReulst.map((resultItem, idx) => (
                                        <div key={idx} className="cardResult">
                                            <div className="resultTitle">
                                                {`${idx + 1}. `} {resultItem.title}
                                            </div>
                                            <div className="resultContent">
                                                {resultItem.content}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <DocCard title="프로젝트 기간">
                            {docData.projectTerm.map((termItem, idx) => (
                                <div key={idx}>{termItem}</div>
                            ))}
                        </DocCard>

                        <DocCard title="프로젝트 성격">{docData.projectType}</DocCard>

                        <DocCard title="담당 역할">
                            {docData.role.map((roleItem, idx) => (
                                <div key={idx}>
                                    {`${idx + 1}. `}
                                    {roleItem}
                                </div>
                            ))}
                        </DocCard>

                        <DocCard title="개발부서">{docData.department}</DocCard>

                        <div className="doc_card">
                            <div className="cardTitle">사용한 기술 스택</div>
                            <div className="cardContent doc_stack">
                                {docData.stack.map((stackItem, idx) => (
                                    <div className="stackItem" key={idx}>
                                        <div className="stackItem_name">
                                            {stackItem.name}
                                        </div>
                                        <div className="stackItem_Image">
                                            <img src={stackItem.img} alt="stackImage" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DocCard title="url">
                            {docData.url || "공개된 URL 없음"}
                        </DocCard>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DOCProgram;

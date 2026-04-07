import React, { useMemo } from "react";
import { css } from "@styled-system/css";
import { projectDatas } from "@shared/lib/data";

interface ProjectResult {
    title: string;
    content: string;
}

interface ProjectStack {
    name: string;
    img: string;
}

interface ProjectData {
    projectName: string;
    projectDesc: string;
    projectImages: string[];
    projectTerm: string[];
    projectType: string;
    projectReulst: ProjectResult[];
    role: string[];
    department: string;
    stack: ProjectStack[];
    url: string;
}

interface DOCProgramProps {
    type: string;
    name: string;
}

interface DocCardProps {
    title: string;
    children: React.ReactNode;
}

const DocCard = ({ title, children }: DocCardProps) => (
    <div className="doc_card">
        <div className="cardTitle">{title}</div>
        <div className="cardContent">{children}</div>
    </div>
);

const DOCProgram = ({ type, name }: DOCProgramProps) => {
    const DOCData = useMemo(() => {
        if (type !== "DOC") return null;

        const target = projectDatas.find(
            (findItem: ProjectData) => findItem.projectName === name
        ) as ProjectData | undefined;

        if (!target) return null;

        return { data: target, keys: Object.keys(target) || [] };
    }, [type, name]);

    if (!DOCData) return null;

    const data = DOCData.data;

    return (
        <>
            <div className={`headerArea2 headerArea2_${type}`}></div>
            <div className={`${docProgramContentStyle} contentsArea_Cover`}>
                <div className="contentsArea_doc">
                    <div className="doc_imageArea">
                        {data.projectImages && data.projectImages.length > 0 ? (
                            <>
                                {data.projectImages.map((imageItem, idx) => (
                                    <div
                                        key={idx}
                                        className="projectImageItem"
                                    >
                                        <img
                                            src={imageItem}
                                            alt={`${imageItem}${idx + 1}`}
                                        />
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="noProjectImage">
                                프로젝트 이미지가 없습니다.
                            </div>
                        )}
                    </div>

                    <div className={`${docProgramContentStyle} doc_contentsArea`}>
                        <DocCard title="프로젝트 명">{data.projectName}</DocCard>

                        <DocCard title="프로젝트 설명">{data.projectDesc}</DocCard>

                        <div className="doc_card">
                            <div className="cardTitle">프로젝트 성과</div>
                            <div className="cardContent doc_reulst">
                                {data.projectReulst &&
                                    data.projectReulst.map((resultItem, idx) => (
                                        <div key={idx} className="cardResult">
                                            <div className="resultTitle">
                                                {`${idx + 1}. `}{" "}
                                                {resultItem.title}
                                            </div>
                                            <div className="resultContent">
                                                {resultItem.content}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <DocCard title="프로젝트 기간">
                            {data.projectTerm.map((termItem, idx) => (
                                <div key={idx}>{termItem}</div>
                            ))}
                        </DocCard>

                        <DocCard title="프로젝트 성격">{data.projectType}</DocCard>

                        <DocCard title="담당 역할">
                            {data.role.map((roleItem, idx) => (
                                <div key={idx}>
                                    {`${idx + 1}. `}
                                    {roleItem}
                                </div>
                            ))}
                        </DocCard>

                        <DocCard title="개발부서">{data.department}</DocCard>

                        <div className="doc_card">
                            <div className="cardTitle">사용한 기술 스택</div>
                            <div className="cardContent doc_stack">
                                {data.stack.map((stackItem, idx) => (
                                    <div className="stackItem" key={idx}>
                                        <div className="stackItem_name">
                                            {stackItem.name}
                                        </div>
                                        <div className="stackItem_Image">
                                            <img
                                                src={stackItem.img}
                                                alt="stackImage"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DocCard title="url">
                            {data.url || "공개된 URL 없음"}
                        </DocCard>
                    </div>
                </div>
            </div>
        </>
    );
};

const docProgramContentStyle = css({
    "& .contentsArea_doc": {
        width: "100%",
        height: "100%",

        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        alignContent: "flex-start",
        boxSizing: "border-box",
        padding: "10px",
    },

    "& .doc_imageArea": {
        width: "100%",
        height: "auto",
        minHeight: "200px",
        backgroundColor: "#e7e7e7",
        display: "inline-block",
        overflow: "scroll",

        flexGrow: 1,
        flexBasis: "500px",
    },

    "& .noProjectImage": {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        color: "#a2a1a1",
        fontSize: "14px",
    },

    "& .projectImageItem": {
        height: "100%",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    "& .projectImageItem img": {
        width: "100%",
        height: "100%",

        objectFit: "contain",
    },

    "& .doc_contentsArea": {
        flex: 1,

        overflow: "scroll",
        height: "100%",
        width: "100%",
        flexGrow: 1,
        flexBasis: "500px",
    },

    "& .doc_card": {
        textAlign: "left",

        boxSizing: "border-box",
        padding: "20px 0",
        borderBottom: "1px solid gray",
    },

    "& .cardTitle": {
        fontWeight: "bold",
        marginBottom: "10px",
    },
    "& .cardContent": {
        fontSize: "12px",
        color: "#4b4b4b",
    },

    "& .doc_stack": {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
    },
    "& .stackItem": {
        border: "1px solid gray",
        padding: "5px 10px",
        borderRadius: "5px",
        width: "fit-content",
        position: "relative",
        cursor: "pointer",
        transition: "0.2s",
    },

    "& .stackItem:hover": {
        color: "white",
        backgroundColor: "gray",
    },
    "& .stackItem:hover .stackItem_Image": {
        bottom: "-45px",
        opacity: 1,

        boxShadow: "0px 0px 10px 2px #a1a1a1",
        scale: 1,
    },

    "& .stackItem_Image": {
        position: "absolute",

        left: "calc(50% - 20px)",
        width: "40px",
        height: "40px",
        bottom: "-35px",

        backgroundColor: "white",
        opacity: 0,
        transition: "0.2s",

        boxSizing: "border-box",
        padding: "5px",

        scale: 0.4,
    },

    "& .doc_reulst": {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },
    "& .stackItem_Image img": {
        width: "100%",
        height: "100%",

        objectFit: "contain",
    },

    "& .resultTitle": {
        marginBottom: "5px",
        fontWeight: "bold",
    },
});

export default DOCProgram;

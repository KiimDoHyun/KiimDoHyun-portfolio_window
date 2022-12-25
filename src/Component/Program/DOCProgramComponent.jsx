import React from "react";
import styled from "styled-components";

const DOCProgramComponent = ({ type, DOCData }) => {
    return (
        <>
            <div className={`headerArea2 headerArea2_${type}`}></div>
            <div className={`contentsArea_Cover`}>
                <div className="contentsArea_doc">
                    <div className="doc_imageArea">
                        {DOCData.data.projectImages &&
                        DOCData.data.projectImages.length > 0 ? (
                            <>
                                {DOCData.data.projectImages.map(
                                    (imageItem, idx) => (
                                        <div
                                            key={idx}
                                            className="projectImageItem"
                                        >
                                            <img
                                                src={imageItem}
                                                alt={`${imageItem}${idx + 1}`}
                                            />
                                        </div>
                                    )
                                )}
                            </>
                        ) : (
                            <div className="noProjectImage">
                                프로젝트 이미지가 없습니다.
                            </div>
                        )}
                    </div>

                    <div className="doc_contentsArea">
                        <div className="doc_card">
                            <div className="cardTitle">프로젝트 명</div>
                            <div className="cardContent">
                                {DOCData.data.projectName}
                            </div>
                        </div>

                        <div className="doc_card">
                            <div className="cardTitle">프로젝트 설명</div>
                            <div className="cardContent">
                                {DOCData.data.projectDesc}
                            </div>
                        </div>
                        <div className="doc_card">
                            <div className="cardTitle">프로젝트 성과</div>
                            <div className="cardContent doc_reulst">
                                {DOCData.data.projectReulst &&
                                    DOCData.data.projectReulst.map(
                                        (resultItem, idx) => (
                                            <div
                                                key={idx}
                                                className="cardResult"
                                            >
                                                <div className="resultTitle">
                                                    {`${idx + 1}. `}{" "}
                                                    {resultItem.title}
                                                </div>
                                                <div className="resultContent">
                                                    {resultItem.content}
                                                </div>
                                            </div>
                                        )
                                    )}
                            </div>
                        </div>

                        <div className="doc_card">
                            <div className="cardTitle">프로젝트 기간</div>
                            <div className="cardContent">
                                {DOCData.data.projectTerm.map(
                                    (termItem, idx) => (
                                        <div key={idx}>{termItem}</div>
                                    )
                                )}
                            </div>
                        </div>
                        <div className="doc_card">
                            <div className="cardTitle">프로젝트 성격</div>
                            <div className="cardContent">
                                {DOCData.data.projectType}
                            </div>
                        </div>
                        <div className="doc_card">
                            <div className="cardTitle">담당 역할</div>
                            <div className="cardContent">
                                {DOCData.data.role.map((roleItem, idx) => (
                                    <div key={idx}>
                                        {`${idx + 1}. `}
                                        {roleItem}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="doc_card">
                            <div className="cardTitle">개발부서</div>
                            <div className="cardContent">
                                {DOCData.data.department}
                            </div>
                        </div>
                        <div className="doc_card">
                            <div className="cardTitle">사용한 기술 스택</div>
                            <div className="cardContent doc_stack">
                                {DOCData.data.stack.map((stackItem, idx) => (
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

                        <div className="doc_card">
                            <div className="cardTitle">url</div>
                            <div className="cardContent">
                                {DOCData.data.url || "공개된 URL 없음"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const DOCProgramComponentBlock = styled.div``;
export default DOCProgramComponent;

import React from "react";
import styled from "styled-components";

const DOCProgramComponent = ({ type, DOCData }) => {
    return (
        <>
            <DOCProgramHeaderBlock
                className={`headerArea2 headerArea2_${type}`}
            ></DOCProgramHeaderBlock>
            <DOCProgramContentBlock className={`contentsArea_Cover`}>
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

                    <DOCProgramContentBlock className="doc_contentsArea">
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
                    </DOCProgramContentBlock>
                </div>
            </DOCProgramContentBlock>
        </>
    );
};

const DOCProgramHeaderBlock = styled.div``;
const DOCProgramContentBlock = styled.div`
    .contentsArea_doc {
        width: 100%;
        height: 100%;

        display: flex;
        gap: 20px;
        flex-wrap: wrap;
        align-content: flex-start;
        box-sizing: border-box;
        padding: 10px;

        // overflow: hidden;
    }

    .doc_imageArea {
        width: 100%;
        height: auto;
        min-height: 200px;
        background-color: #e7e7e7;
        display: inline-box;
        overflow: scroll;

        flex-grow: 1;
        flex-basis: 500px;
    }

    .noProjectImage {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        color: #a2a1a1;
        font-size: 14px;
    }

    .projectImageItem {
        height: 100%;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .projectImageItem img {
        width: 100%;
        height: 100%;

        object-fit: contain;
    }

    .doc_contentsArea {
        flex: 1;

        overflow: scroll;
        height: 100%;
        width: 100%;
        flex-grow: 1;
        flex-basis: 500px;
    }

    .doc_card {
        text-align: left;

        box-sizing: border-box;
        padding: 20px 0;
        border-bottom: 1px solid gray;
    }

    .cardTitle {
        font-weight: bold;
        margin-bottom: 10px;
    }
    .cardContent {
        font-size: 12px;
        color: #4b4b4b;
    }

    .doc_stack {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }
    .stackItem {
        border: 1px solid gray;
        padding: 5px 10px;
        border-radius: 5px;
        width: fit-content;
        position: relative;
        cursor: pointer;
        transition: 0.2s;
    }

    .stackItem:hover {
        color: white;
        background-color: gray;
    }
    .stackItem:hover .stackItem_Image {
        bottom: -45px;
        opacity: 1;

        box-shadow: 0px 0px 10px 2px #a1a1a1;
        scale: 1;
    }

    .stackItem_Image {
        position: absolute;

        left: calc(50% - 20px);
        width: 40px;
        height: 40px;
        bottom: -35px;

        background-color: white;
        opacity: 0;
        transition: 0.2s;

        box-sizing: border-box;
        padding: 5px;

        scale: 0.4;
    }

    .doc_reulst {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    .stackItem_Image img {
        width: 100%;
        height: 100%;

        object-fit: contain;
    }

    .resultTitle {
        margin-bottom: 5px;
        font-weight: bold;
    }
`;
export default DOCProgramComponent;

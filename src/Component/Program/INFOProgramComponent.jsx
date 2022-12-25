import React from "react";
import styled from "styled-components";

import KDH from "../../asset/images/김도현.jpg";
import blogLine from "../../asset/images/icons/blog_line.png";
import githubLine from "../../asset/images/icons/github_line.png";
import companyLine from "../../asset/images/icons/company_line.png";
import linkedin from "../../asset/images/icons/linkedin_line.png";

import campus from "../../asset/images/icons/campus_line_blue.png";
import book from "../../asset/images/icons/book_line_blue.png";
import coding from "../../asset/images/icons/coding_line_blue.png";
import business from "../../asset/images/icons/business_line_blue.png";
import gear from "../../asset/images/icons/gear_line_blue.png";
import web from "../../asset/images/icons/web_line_blue.png";
import companyBlue from "../../asset/images/icons/company_line_blue.png";

const INFOProgramComponent = ({ type }) => {
    return (
        <>
            <div className={`headerArea2 headerArea2_${type}`}></div>
            <div className={`contentsArea_Cover`}>
                <div className="contentsArea_info">
                    <div className="top">
                        <div className="info1">
                            <div className="myImageArea">
                                <img src={KDH} alt="김도현" />
                            </div>
                            <div className="myInfoArea">
                                <h1>김도현</h1>
                                <p style={{ userSelect: "text" }}>
                                    bzidol@naver.com
                                </p>
                                <p>010-7793-5630</p>
                                <p>{"남자 / 27 세"}</p>
                            </div>
                        </div>
                        <div className="info2">
                            <div className="infoItem">
                                <div className="myImageArea">
                                    <img src={githubLine} alt="Git" />
                                </div>
                                <div className="myInfoArea">
                                    <p>Git</p>
                                    <a
                                        target={"_blank"}
                                        href="https://github.com/KiimDoHyun"
                                    >
                                        이동하기
                                    </a>
                                </div>
                            </div>
                            <div className="infoItem">
                                <div className="myImageArea">
                                    <img src={blogLine} alt="Blog" />
                                </div>
                                <div className="myInfoArea">
                                    <p>Blog</p>
                                    <a
                                        target={"_blank"}
                                        href="https://velog.io/@kdh123"
                                    >
                                        이동하기
                                    </a>
                                </div>
                            </div>
                            <div className="infoItem">
                                <div className="myImageArea">
                                    <img src={companyLine} alt="Company" />
                                </div>
                                <div className="myInfoArea">
                                    <p>Company</p>
                                    <a
                                        target={"_blank"}
                                        href="https://araonsoft.com/"
                                    >
                                        이동하기
                                    </a>
                                </div>
                            </div>
                            <div className="infoItem">
                                <div className="myImageArea">
                                    <img src={linkedin} alt="linkedin" />
                                </div>
                                <div className="myInfoArea">
                                    <p>linkedin</p>
                                    <a
                                        target={"_blank"}
                                        href="https://www.linkedin.com/in/%EB%8F%84%ED%98%84-%EA%B9%80-b4a477252/"
                                    >
                                        이동하기
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="body">
                        <div className="infoItem">
                            <div className="myImageArea">
                                <img src={campus} alt="campus" />
                            </div>
                            <div className="myInfoArea">
                                <p className="title">대학교</p>
                                <p className="desc">금오공과대학교</p>
                            </div>
                        </div>
                        <div className="infoItem">
                            <div className="myImageArea">
                                <img src={book} alt="book" />
                            </div>
                            <div className="myInfoArea">
                                <p className="title">학과</p>
                                <p className="desc">컴퓨터공학과</p>
                            </div>
                        </div>
                        <div className="infoItem">
                            <div className="myImageArea">
                                <img src={business} alt="business" />
                            </div>
                            <div className="myInfoArea">
                                <p className="title">경력</p>
                                <p className="desc">{"1 년(주니어)"}</p>
                            </div>
                        </div>
                        <div className="infoItem">
                            <div className="myImageArea">
                                <img src={web} alt="web" />
                            </div>
                            <div className="myInfoArea">
                                <p className="title">분야</p>
                                <p className="desc">Front-end</p>
                            </div>
                        </div>
                        <div className="infoItem">
                            <div className="myImageArea">
                                <img src={companyBlue} alt="Company" />
                            </div>
                            <div className="myInfoArea">
                                <p className="title">회사</p>
                                <p className="desc">{"(주)아라온소프트"}</p>
                            </div>
                        </div>
                        <div className="infoItem">
                            <div className="myImageArea">
                                <img src={gear} alt="gear" />
                            </div>
                            <div className="myInfoArea">
                                <p className="title">주 스택</p>
                                <p className="desc">React</p>
                            </div>
                        </div>
                        <div className="infoItem">
                            <div className="myImageArea">
                                <img src={coding} alt="coding" />
                            </div>
                            <div className="myInfoArea">
                                <p className="title">주 언어</p>
                                <p className="desc">자바스크립트</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const INFOProgramComponentBlock = styled.div``;
export default INFOProgramComponent;

import React from "react";
import { css } from "@styled-system/css";

import KDH from "@images/김도현.jpg";
import blogLine from "@images/icons/blog_line.png";
import githubLine from "@images/icons/github_line.png";
import companyLine from "@images/icons/company_line.png";
import linkedin from "@images/icons/linkedin_line.png";

import campus from "@images/icons/campus_line_blue.png";
import book from "@images/icons/book_line_blue.png";
import coding from "@images/icons/coding_line_blue.png";
import business from "@images/icons/business_line_blue.png";
import gear from "@images/icons/gear_line_blue.png";
import web from "@images/icons/web_line_blue.png";
import companyBlue from "@images/icons/company_line_blue.png";

const InfoProgramView = ({ type }) => {
    return (
        <>
            <div
                className={`headerArea2 headerArea2_${type}`}
            ></div>
            <div className={`${infoProgramContentStyle} contentsArea_Cover`}>
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
                                        rel="noreferrer"
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
                                        rel="noreferrer"
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
                                        href="https://www.whatap.io/ko/"
                                        // href="https://araonsoft.com/"
                                        rel="noreferrer"
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
                                        rel="noreferrer"
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
                                <p className="desc">{"와탭랩스"}</p>
                                {/* <p className="desc">{"(주)아라온소프트"}</p> */}
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

const infoProgramContentStyle = css({
    "& .contentsArea_info": {
        width: "100%",
        height: "100%",
    },

    "& .contentsArea_info .top": {
        minHeight: "200px",
        backgroundColor: "#f3f3f3",

        display: "flex",
        flexWrap: "wrap",

        padding: "50px 10px",
        boxSizing: "border-box",

        rowGap: "50px",
    },
    "& .contentsArea_info .body": {
        display: "flex",
        flexWrap: "wrap",
        gap: "50px",

        padding: "20px 10px",
        boxSizing: "border-box",
    },

    "& .info1": {
        display: "flex",
        alignItems: "center",
        gap: "50px",

        flexGrow: 1,
        flexBasis: "500px",

        justifyContent: "center",
    },

    "& .info1 .myImageArea": {
        width: "180px",
        height: "180px",

        padding: "10px",
        boxSizing: "border-box",
    },

    "& .info1 .myImageArea img": {
        width: "100%",
        height: "100%",
        borderRadius: "100%",
        objectFit: "cover",
    },

    "& .info1 .myInfoArea": {
        textAlign: "left",
    },

    "& .info1 .myInfoArea h1": {
        margin: "0 0 10px 0",
    },

    "& .info1 .myInfoArea p": {
        color: "gray",
        margin: "0 0 5px 0",
    },

    "& .info2": {
        display: "flex",
        flexWrap: "wrap",

        columnGap: "100px",
        rowGap: "30px",

        flexGrow: 1,
        flexBasis: "500px",
    },
    "& .info2 .infoItem": {
        width: "180px",
    },

    "& .infoItem": {
        display: "flex",
        alignItems: "center",
        gap: "30px",
    },

    "& .infoItem .myImageArea": {
        width: "75px",
        height: "75px",

        boxSizing: "border-box",
        padding: "10px",
    },

    "& .infoItem .myImageArea img": {
        width: "100%",
        height: "100%",
    },

    "& .body .myInfoArea, & .info2 .myInfoArea": {
        textAlign: "left",
    },

    "& .myInfoArea .desc": {
        margin: "0",
        fontSize: "14px",
        color: "#202020",
    },

    "& .body .infoItem": {
        boxSizing: "border-box",
        padding: "0 10px",
        width: "230px",
        border: "2px solid #ffffff00",
        transition: "0.2s",

        gap: "20px",
    },
    "& .body .infoItem:hover": {
        borderColor: "#dfdfdf",
    },

    "& .body .infoItem .title, & .info2 .myInfoArea p": {
        margin: "5px 0",
        fontWeight: "bold",
    },
    "& .body .myInfoArea a, & .info2 .myInfoArea a": {
        textDecoration: "none",
        color: "#76b3e4",

        fontSize: "14px",
    },
});
export default InfoProgramView;

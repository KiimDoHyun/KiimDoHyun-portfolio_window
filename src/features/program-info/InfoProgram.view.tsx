import { css } from "@styled-system/css";
import { resolveAsset } from "@shared/lib/assetManifest";
import type { ResumeData } from "@shared/types/content";

interface InfoProgramViewProps {
    data: ResumeData;
}

const InfoProgramView = ({ data }: InfoProgramViewProps) => {
    return (
        <>
            <div className="headerArea2 headerArea2_INFO"></div>
            <div className={`${infoProgramContentStyle} contentsArea_Cover`}>
                <div className="contentsArea_info">
                    <div className="top">
                        <div className="info1">
                            <div className="myImageArea">
                                <img src={resolveAsset(data.photo) ?? ""} alt={data.name} />
                            </div>
                            <div className="myInfoArea">
                                <h1>{data.name}</h1>
                                <p style={{ userSelect: "text" }}>{data.email}</p>
                                <p>{data.phone}</p>
                                <p>{data.summary}</p>
                            </div>
                        </div>
                        <div className="info2">
                            {data.links.map((link) => (
                                <div className="infoItem" key={link.label}>
                                    <div className="myImageArea">
                                        <img src={resolveAsset(link.icon) ?? ""} alt={link.label} />
                                    </div>
                                    <div className="myInfoArea">
                                        <p>{link.label}</p>
                                        <a target="_blank" href={link.url} rel="noreferrer">
                                            이동하기
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="body">
                        {data.details.map((item) => (
                            <div className="infoItem" key={item.label}>
                                <div className="myImageArea">
                                    <img src={resolveAsset(item.icon) ?? ""} alt={item.label} />
                                </div>
                                <div className="myInfoArea">
                                    <p className="title">{item.label}</p>
                                    <p className="desc">{item.value}</p>
                                </div>
                            </div>
                        ))}
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
        backgroundColor: "surface.light",

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
        color: "surface.textStrong",
    },

    "& .body .infoItem": {
        boxSizing: "border-box",
        padding: "0 10px",
        width: "230px",
        border: "2px solid transparent",
        transition: "fast",

        gap: "20px",
    },
    "& .body .infoItem:hover": {
        borderColor: "surface.border",
    },

    "& .body .infoItem .title, & .info2 .myInfoArea p": {
        margin: "5px 0",
        fontWeight: "bold",
    },
    "& .body .myInfoArea a, & .info2 .myInfoArea a": {
        textDecoration: "none",
        color: "accent.link",

        fontSize: "14px",
    },
});
export default InfoProgramView;

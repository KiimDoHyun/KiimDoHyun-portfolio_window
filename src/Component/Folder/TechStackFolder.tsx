import React from "react";
import styled from "styled-components";
import folderEmpty from "../../asset/images/icons/folder_empty.png";

const TechStackFolder = () => {
    return (
        <TechStackFolderBlock className="contentsArea_folder">
            <div className="folder">
                <img src={folderEmpty} alt="folderEmpty" />
                <div className="name">
                    폴더 2asdfasdfasdfasdfasdfasdfasdfasdf번
                </div>
            </div>
        </TechStackFolderBlock>
    );
};

const TechStackFolderBlock = styled.div``;
export default TechStackFolder;

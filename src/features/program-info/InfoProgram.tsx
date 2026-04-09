import InfoProgramView from "./InfoProgram.view";
import type { ResumeData } from "@shared/types/content";

interface InfoProgramProps {
    contents: ResumeData;
}

const InfoProgram = ({ contents }: InfoProgramProps) => {
    return <InfoProgramView data={contents} />;
};

export default InfoProgram;

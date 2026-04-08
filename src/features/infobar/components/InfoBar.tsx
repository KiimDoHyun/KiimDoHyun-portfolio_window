import React from "react";
import CommitItem from "./CommitItem";
import ErrorBox from "./ErrorBox";
import sum from "@images/icons/sun.png";
import { InfoBarBlock } from "./InfoBar.style";

interface CommitData {
  commit: {
    author: { name: string; date: string };
    message: string;
  };
}

interface InfoBarViewProps {
  active: boolean;
  commit: {
    data: Array<CommitData> | null;
    error: unknown;
  };
  displayLight: number;
  onChange: (e: { target: { value: string } }) => void;
}

const InfoBar = ({ active, commit, displayLight, onChange }: InfoBarViewProps) => {
  const { data, error } = commit;

  return (
    <InfoBarBlock active={active}>
      <div className="commitArea">
        {error && <ErrorBox />}
        {data && data.map((item, idx) => <CommitItem item={item} key={idx} />)}
      </div>
      <div className="displayLightArea">
        <div className="iconCover">
          <img src={sum} alt="sum" />
        </div>
        <input
          type={"range"}
          min={1}
          max={100}
          value={displayLight}
          onChange={onChange}
        />
      </div>
    </InfoBarBlock>
  );
};

export default InfoBar;

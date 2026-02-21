import React, { useCallback, useRef } from "react";
import Window from "./components/Window";
import { useRecoilValue } from "recoil";
import { rc_program_programList } from "@store/program";
import { useActiveProgram } from "@fsd/window/4_features/program";
import { rc_global_Directory_Tree } from "@store/global";

const WindowContainer = () => {
  const windowRef = useRef(null);

  const programList = useRecoilValue(rc_program_programList);
  const Directory_Tree = useRecoilValue(rc_global_Directory_Tree);

  // 아이콘 클릭
  const onClickIcon = useCallback((item) => {}, []);

  // 아이콘 더블클릭 (활성화)
  const onDoubleClickIcon = useActiveProgram();

  const propDatas = {
    windowRef,
    iconBoxArr: (Directory_Tree as { root: any }).root || [],
    onClickIcon,
    onDoubleClickIcon,
  };

  return (
    <>
      <Window {...propDatas} />
      {programList.map((item) => {
        const Component = item.Component;

        return (
          <Component
            key={`${item.name}`}
            // name={item.name}
            // type={item.type}
            // parent={item.parent}
            // status={item.statue}
            // contents={item.contents}
            item={item}
          />
        );
      })}
    </>
  );
};

export default React.memo(WindowContainer);

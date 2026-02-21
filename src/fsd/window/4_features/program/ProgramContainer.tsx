import React, { useCallback, useEffect, useRef } from "react";
import ProgramComponent from "./components/ProgramComponent";
import {
  rc_program_activeProgram,
  rc_program_programList,
  rc_program_zIndexCnt,
} from "@store/program";
import { useSetRecoilState, useRecoilState } from "recoil";
import { useState } from "react";

const ProgramContainer = ({
  item: { name, type, parent, status, contents },
}) => {
  const setProgramList = useSetRecoilState(rc_program_programList);
  const setZIndexCnt = useSetRecoilState(rc_program_zIndexCnt);

  const [activeProgram, setActiveProgram] = useRecoilState(
    rc_program_activeProgram
  );
  const [isMovable, setIsMovable] = useState(false);
  const [isResizable, setIsResizable] = useState(false);
  const [isClose, setIsClose] = useState(false);
  const [isMaxSize, setIsMaxSize] = useState(false);

  // 보기 유형
  const prevPos = useRef(null);
  const boxRef = useRef(null);

  // 현재 창 클릭
  const onClick = useCallback(() => {
    setActiveProgram(name);
  }, [setActiveProgram, name]);

  // 최대화
  const onClickMax = useCallback(() => {
    setIsMaxSize(true);
    boxRef.current.style.transition = "0.25s";
    boxRef.current.style.left = "0";
    boxRef.current.style.top = "0";

    localStorage.setItem(`${name}width`, "100vw");
    localStorage.setItem(`${name}height`, "calc(100vh - 50px)");

    boxRef.current.style.width = "100vw";
    boxRef.current.style.height = "calc(100vh - 50px)";

    /*
        최대화

        trainsition: 0.25s;
        left: 0;
        top: 0;
        width: 100vw;
        height: calc(100vh - 50px)
        */
  }, [setIsMaxSize, name]);

  // 기본 크기
  const onClickNormalSize = useCallback(() => {
    setIsMaxSize(false);

    const left = localStorage.getItem(`${name}Left`);
    const top = localStorage.getItem(`${name}Top`);
    boxRef.current.style.transition = "0.25s";

    boxRef.current.style.left = left + "px";
    boxRef.current.style.top = top + "px";

    localStorage.setItem(`${name}width`, "500px");
    localStorage.setItem(`${name}height`, "500px");

    boxRef.current.style.width = "500px";
    boxRef.current.style.height = "500px";

    /*
        기본크기

        trainsition: 0.25s;
        left: 0; // -> 이전 기본 크기
        top: 0; // -> 이전 기본 크기
        width: 500px;
        height: 500px;
        */
  }, [setIsMaxSize, name]);

  // 최소화
  const onClickMin = useCallback(() => {
    setProgramList((prev) =>
      prev.map((prevItem) =>
        prevItem.name === name
          ? { ...prevItem, status: "min" }
          : { ...prevItem }
      )
    );
  }, [name, setProgramList]);

  // 닫기
  const onClickClose = useCallback(() => {
    setIsClose(true);
    boxRef.current.style.transition = "0.25s";
    boxRef.current.style.opacity = "0";

    setTimeout(() => {
      setProgramList((prev) =>
        prev.filter((filterItem) => filterItem.name !== name)
      );
    }, 300);
  }, [name, setProgramList]);

  // 이동 활성화
  const onMouseDown = useCallback(
    (e) => {
      setIsMovable(true);
      prevPos.current = {
        X: e.clientX,
        Y: e.clientY,
      };
    },
    [setIsMovable]
  );

  // 이동
  const onMouseMove = useCallback(
    (e) => {
      // if (e.clientY <= 0) {
      //     console.log("exit");
      //     return;
      // }
      // 이전 좌표와 현재 좌표 차이값
      if (isMovable) {
        const posX = prevPos.current.X - e.clientX;
        const posY = prevPos.current.Y - e.clientY;

        // 현재 좌표가 이전 좌표로 바뀜
        prevPos.current = {
          X: e.clientX,
          Y: e.clientY,
        };

        // left, top으로 이동

        boxRef.current.style.transition = "0s";

        localStorage.setItem(
          `${name}Left`,
          String(boxRef.current.offsetLeft - posX)
        );
        localStorage.setItem(
          `${name}Top`,
          String(boxRef.current.offsetTop - posY)
        );

        boxRef.current.style.left = boxRef.current.offsetLeft - posX + "px";
        boxRef.current.style.top = boxRef.current.offsetTop - posY + "px";
      }

      if (isResizable) {
        /*
                    posX 에 이전과 커서 위치 차이값이 들어있다.

                    마우스가 움직이면서 이전 좌표값을 갱신한다

                    차이값 만큼 width, height 값을 계산한다

                    만약 최소값보다 큰 경우만 값을 갱신한다

                    만약 최소값 이하로 내려가려한다면?

                    커서값은 계속 갱신된다. (현재 위치좌표로)

                    커서가 오른쪽으로 움직이는 순간

                    좌표 값 차이만큼 width 값이 변한다
                    이때 커서는 한참 왼쪽에있다.

                    커서가 다시 원래 위치로 오고 나서 값 계산에 따른 너비를 갱신해야한다.

                    원래위치는 최소 값에 도달한 위치를 말한다.

                    크기 조정함수 공통화 필요

                */

        // 커서의 이전 위치를 기반으로 어느 방향으로 움직일지 체크
        boxRef.current.style.transition = "0s";
        const posX = prevPos.current.X - e.clientX;
        const posY = prevPos.current.Y - e.clientY;

        // 크기 값 갱신
        const newWidth = boxRef.current.offsetWidth - posX;
        const newHeight = boxRef.current.offsetHeight - posY;

        // ====================
        // 상
        if (posX === 0 && posY > 0) {
          if (newHeight < 60) {
          } else {
            localStorage.setItem(
              `${name}height`,
              `${boxRef.current.offsetHeight - posY}px`
            );

            boxRef.current.style.height =
              boxRef.current.offsetHeight - posY + "px";

            // 현재 좌표가 이전 좌표로 바뀜
            prevPos.current.Y = e.clientY;
          }
        }
        // 하
        else if (posX === 0 && posY < 0) {
          if (prevPos.current.Y <= e.clientY) {
            localStorage.setItem(
              `${name}height`,
              `${boxRef.current.offsetHeight - posY}px`
            );

            boxRef.current.style.height =
              boxRef.current.offsetHeight - posY + "px";

            // 현재 좌표가 이전 좌표로 바뀜
            prevPos.current.Y = e.clientY;
          }
        }
        // 좌
        else if (posX > 0 && posY === 0) {
          if (newWidth < 300) {
          } else {
            localStorage.setItem(
              `${name}width`,
              `${boxRef.current.offsetWidth - posX}px`
            );

            boxRef.current.style.width =
              boxRef.current.offsetWidth - posX + "px";

            // 현재 좌표가 이전 좌표로 바뀜
            prevPos.current.X = e.clientX;
            //
          }
        }
        // 우
        else if (posX < 0 && posY === 0) {
          if (prevPos.current.X <= e.clientX) {
            localStorage.setItem(
              `${name}width`,
              `${boxRef.current.offsetWidth - posX}px`
            );

            boxRef.current.style.width =
              boxRef.current.offsetWidth - posX + "px";
            // 마우스 위치..

            // 현재 좌표가 이전 좌표로 바뀜
            prevPos.current.X = e.clientX;
          }
        }
        // 왼쪽 위
        else if (posX > 0 && posY > 0) {
          if (newWidth < 300) {
          } else {
            localStorage.setItem(
              `${name}width`,
              `${boxRef.current.offsetWidth - posX}px`
            );

            boxRef.current.style.width =
              boxRef.current.offsetWidth - posX + "px";

            // 현재 좌표가 이전 좌표로 바뀜
            prevPos.current.X = e.clientX;
            //
          }

          if (newHeight < 60) {
          } else {
            localStorage.setItem(
              `${name}height`,
              `${boxRef.current.offsetHeight - posY}px`
            );

            boxRef.current.style.height =
              boxRef.current.offsetHeight - posY + "px";

            // 현재 좌표가 이전 좌표로 바뀜
            prevPos.current.Y = e.clientY;
          }
        }
        // 오른쪽 위
        else if (posX < 0 && posY > 0) {
          if (prevPos.current.X <= e.clientX) {
            localStorage.setItem(
              `${name}width`,
              `${boxRef.current.offsetWidth - posX}px`
            );

            boxRef.current.style.width =
              boxRef.current.offsetWidth - posX + "px";
            // 마우스 위치..

            // 현재 좌표가 이전 좌표로 바뀜
            prevPos.current.X = e.clientX;
          }

          if (newHeight < 60) {
          } else {
            localStorage.setItem(
              `${name}height`,
              `${boxRef.current.offsetHeight - posY}px`
            );

            boxRef.current.style.height =
              boxRef.current.offsetHeight - posY + "px";

            // 현재 좌표가 이전 좌표로 바뀜
            prevPos.current.Y = e.clientY;
          }
        }
        // 왼쪽 아래
        else if (posX > 0 && posY < 0) {
          if (newWidth < 300) {
          } else {
            localStorage.setItem(
              `${name}width`,
              `${boxRef.current.offsetWidth - posX}px`
            );

            boxRef.current.style.width =
              boxRef.current.offsetWidth - posX + "px";

            // 현재 좌표가 이전 좌표로 바뀜
            prevPos.current.X = e.clientX;
            //
          }

          if (prevPos.current.Y <= e.clientY) {
            localStorage.setItem(
              `${name}height`,
              `${boxRef.current.offsetHeight - posY}px`
            );

            boxRef.current.style.height =
              boxRef.current.offsetHeight - posY + "px";

            // 현재 좌표가 이전 좌표로 바뀜
            prevPos.current.Y = e.clientY;
          }
        }
        // 오른쪽 아래
        else if (posX < 0 && posY < 0) {
          if (prevPos.current.X <= e.clientX) {
            localStorage.setItem(
              `${name}width`,
              `${boxRef.current.offsetWidth - posX}px`
            );

            boxRef.current.style.width =
              boxRef.current.offsetWidth - posX + "px";
            // 마우스 위치..

            // 현재 좌표가 이전 좌표로 바뀜
            prevPos.current.X = e.clientX;
          }

          if (prevPos.current.Y <= e.clientY) {
            localStorage.setItem(
              `${name}height`,
              `${boxRef.current.offsetHeight - posY}px`
            );

            boxRef.current.style.height =
              boxRef.current.offsetHeight - posY + "px";

            // 현재 좌표가 이전 좌표로 바뀜
            prevPos.current.Y = e.clientY;
          }
        }
      }
    },
    [isMovable, isResizable, name]
  );

  // 이동 종료
  const onMouseUp = useCallback(() => {
    setIsMovable(false);
  }, []);

  // 현재 창 맨 앞으로
  useEffect(() => {
    if (activeProgram === name) {
      setZIndexCnt((prev) => {
        boxRef.current.style.zIndex = prev + 1;
        return prev + 1;
      });

      // boxRef.current.style.zIndex = temp_zIndexCnt + 1;
      // setZIndexCnt((prev) => prev + 1);
    }
  }, [activeProgram, name, setZIndexCnt]);

  // 이동 활성화
  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);

    // 마우스 클릭이 종료되는 경우 모든 이벤트 종료 처리 필요
    document.addEventListener("mouseup", () => setIsResizable(false));

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [onMouseMove]);

  useEffect(() => {
    if (status === "active") {
      if (isMaxSize) {
        boxRef.current.style.left = "0px";
        boxRef.current.style.top = "0px";
      } else {
        const left = localStorage.getItem(`${name}Left`);
        const top = localStorage.getItem(`${name}Top`);

        //
        if (left && top) {
          boxRef.current.style.left = left + "px";
          boxRef.current.style.top = top + "px";
        } else {
          boxRef.current.style.left = "calc(50vw - 250px)";
          boxRef.current.style.top = "calc(50vh - 250px)";
        }
      }
    }
  }, [status, isMaxSize, boxRef, name]);

  useEffect(() => {
    /*
        min
        active
        */

    // 활성화
    if (status === "active") {
      boxRef.current.style.transition = "0.25s";
      boxRef.current.style.opacity = "1";

      const height = localStorage.getItem(`${name}height`);
      const width = localStorage.getItem(`${name}width`);

      if (height && width) {
        boxRef.current.style.height = height;
        boxRef.current.style.width = width;
      } else {
        boxRef.current.style.width = "500px";
        boxRef.current.style.height = "500px";
      }

      boxRef.current.style.scale = "1";
    }
    // 최소화
    else if (status === "min") {
      boxRef.current.style.transition = "0.25s";
      boxRef.current.style.opacity = "0";
      boxRef.current.style.left = "80px";
      boxRef.current.style.top = "60vh";
      boxRef.current.style.scale = "0.6";
      boxRef.current.style.width = "500px";
      boxRef.current.style.height = "500px";
    }
  }, [status, name]);

  const onMouseDown_Resize = useCallback((e) => {
    setIsResizable(true);
    prevPos.current = {
      X: e.clientX,
      Y: e.clientY,
    };
  }, []);

  const onMouseUp_Resize = useCallback(() => {
    //
    setIsResizable(false);
  }, []);

  useEffect(() => {
    return () => {
      localStorage.removeItem(`${name}Left`);
      localStorage.removeItem(`${name}Top`);
      localStorage.removeItem(`${name}width`);
      localStorage.removeItem(`${name}height`);
    };
  }, [name]);

  const propDatas = {
    onClick,
    onClickClose,
    onClickMax,
    onClickNormalSize,
    onClickMin,
    onMouseDown,
    onMouseUp,
    onMouseDown_Resize,
    onMouseUp_Resize,

    boxRef,
    isClose,
    isMaxSize,
    item: { name, type, parent, status, contents },
  };
  return <ProgramComponent {...propDatas} />;
};

export default React.memo(ProgramContainer);

import React from "react";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { directory } from "../Common/data";
import {
    rc_global_Directory_List,
    rc_global_Directory_Tree,
} from "../store/global";

const SetDirectory = () => {
    const setDirectory_Tree = useSetRecoilState(rc_global_Directory_Tree);
    const setDirectory_List = useSetRecoilState(rc_global_Directory_List);

    useEffect(() => {
        let temp = {};

        // 트리를 위해 데이터구조 변경
        directory.forEach((item) => {
            if (!temp[item.parent]) {
                temp[item.parent] = [item];
            } else {
                temp[item.parent].push(item);
            }
        });

        setDirectory_Tree(temp);

        let changedDirectory = [];

        // 깊이우선 탐색
        const DFS = (start, target) => {
            let dfsList = [start];
            let visited = [];
            let route = [];

            while (dfsList.length !== 0) {
                const node = dfsList[0];

                // 방문 여부
                // 방문한 적이 있다면
                if (visited.some((visitItem) => visitItem === node)) {
                    dfsList.shift();
                    route.pop();
                    continue;
                }
                // 처음 방문 한다면.
                else {
                    visited.push(node);
                    route.push(node);
                }

                // 찾고자 하는 노드라면 종료.
                if (node === target) {
                    return route;
                }

                // 자식이 있는가.
                if (temp[node]) {
                    dfsList = [
                        ...temp[node].map((item) => item.name),
                        ...dfsList,
                    ];
                }
                // 자식이 없다.
                else {
                    dfsList.shift();
                    route.pop();
                }
            }
        };

        // 각 파일의 경로 탐색
        directory.forEach((item) => {
            const curName = item.name;

            const result = DFS("KDH", curName);
            changedDirectory.push({
                ...item,
                route: `/ ${result.toString().replace(/,/g, " / ")}`,
            });
        });

        // 경로 정보를 추가한다.
        setDirectory_List(changedDirectory);
    }, [setDirectory_Tree]);
    return <></>;
};

export default SetDirectory;

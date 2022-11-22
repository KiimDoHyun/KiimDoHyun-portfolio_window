import React from "react";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { directory } from "../Common/data";
import { rc_global_Directory_Tree } from "../store/global";

const SetDirectory = () => {
    const setDirectory_Tree = useSetRecoilState(rc_global_Directory_Tree);
    useEffect(() => {
        let temp = {};

        directory.forEach((item) => {
            if (!temp[item.parent]) {
                temp[item.parent] = [item];
            } else {
                temp[item.parent].push(item);
            }
        });

        console.log("temp: ", temp);
        setDirectory_Tree(temp);
    }, [setDirectory_Tree]);
    return <></>;
};

export default SetDirectory;

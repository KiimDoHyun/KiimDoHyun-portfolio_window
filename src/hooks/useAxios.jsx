import { useState } from "react";
import { useCallback } from "react";

const useAxios = (api) => {
    const [state, setState] = useState({
        data: null,
        error: null,
    });

    const getData = useCallback(async () => {
        try {
            const { data } = await api();
            setState({
                data: data,
                error: null,
            });
        } catch (e) {
            setState({
                data: null,
                error: e,
            });
        }
    }, [api]);

    return [state, getData];
};

export default useAxios;

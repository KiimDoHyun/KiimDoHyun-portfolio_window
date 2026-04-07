import { useContext } from "react";
import { DesktopDataContext } from "./DesktopDataContext";
import type { DesktopDataValue } from "./DesktopDataContext";

export const useDesktopData = (): DesktopDataValue => {
    const ctx = useContext(DesktopDataContext);
    if (!ctx) {
        throw new Error(
            "useDesktopData must be used within DesktopDataContext.Provider"
        );
    }
    return ctx;
};

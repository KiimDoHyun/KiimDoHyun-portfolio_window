import type { ReactNode } from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";

type TooltipProviderProps = {
    children: ReactNode;
};

const TOOLTIP_DELAY_MS = 150;
const TOOLTIP_SKIP_DELAY_MS = 300;

const TooltipProvider = ({ children }: TooltipProviderProps) => {
    return (
        <RadixTooltip.Provider
            delayDuration={TOOLTIP_DELAY_MS}
            skipDelayDuration={TOOLTIP_SKIP_DELAY_MS}
        >
            {children}
        </RadixTooltip.Provider>
    );
};

export default TooltipProvider;

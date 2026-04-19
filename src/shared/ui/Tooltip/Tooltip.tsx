import type { ReactNode } from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { css } from "@styled-system/css";

const contentStyle = css({
    backgroundColor: "#2b2b2b",
    color: "#ffffff",
    fontSize: "12px",
    lineHeight: "1.2",
    padding: "6px 10px",
    border: "1px solid #3f3f3f",
    borderRadius: "2px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.35)",
    maxWidth: "260px",
    wordBreak: "keep-all",
    userSelect: "none",
    zIndex: 9999,
});

type TooltipProps = {
    label: string;
    children: ReactNode;
    side?: "top" | "right" | "bottom" | "left";
    sideOffset?: number;
    disabled?: boolean;
};

const Tooltip = ({
    label,
    children,
    side = "bottom",
    sideOffset = 4,
    disabled = false,
}: TooltipProps) => {
    if (disabled) return <>{children}</>;

    return (
        <RadixTooltip.Root>
            <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
            <RadixTooltip.Portal>
                <RadixTooltip.Content
                    className={contentStyle}
                    side={side}
                    sideOffset={sideOffset}
                    collisionPadding={8}
                >
                    {label}
                </RadixTooltip.Content>
            </RadixTooltip.Portal>
        </RadixTooltip.Root>
    );
};

export default Tooltip;

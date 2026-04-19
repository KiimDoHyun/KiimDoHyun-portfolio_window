import { cva } from "@styled-system/css";
import { styled } from "@styled-system/jsx";
import Windows from "@shared/ui/icons/Windows";

interface StartButtonProps {
    onClick: () => void;
}

const StartButtonRoot = styled(
    "div",
    cva({
        base: {
            width: "taskbar",
            height: "taskbar",
            padding: "16",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "fast",
            "& svg": {
                width: "100%",
                height: "100%",
            },
            "& path": {
                fill: "shell.text",
            },
            _hover: {
                backgroundColor: "overlay.hover",
                "& path": {
                    fill: "accent.hover",
                },
            },
            _active: {
                "& path": {
                    fill: "accent.solid",
                },
            },
        },
    })
);

const StartButton = ({ onClick }: StartButtonProps) => {
    return (
        <StartButtonRoot onClick={onClick}>
            <Windows />
        </StartButtonRoot>
    );
};

export default StartButton;

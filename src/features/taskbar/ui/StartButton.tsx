import Windows from "@shared/ui/icons/Windows";

interface StartButtonProps {
    onClick: () => void;
}

const StartButton = ({ onClick }: StartButtonProps) => {
    return (
        <div className="box1 taskHoverEffect" onClick={onClick}>
            <Windows />
        </div>
    );
};

export default StartButton;

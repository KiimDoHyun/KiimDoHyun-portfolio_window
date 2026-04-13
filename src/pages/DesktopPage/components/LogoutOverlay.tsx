import { logoutOverlayStyle } from "./LogoutOverlay.style";
import { LOGOUT_FADE_DURATION_MS } from "../constants/logout";

type LogoutOverlayProps = {
    visible: boolean;
};

const LogoutOverlay = ({ visible }: LogoutOverlayProps) => {
    return (
        <div
            className={logoutOverlayStyle}
            style={{
                opacity: visible ? 1 : 0,
                "--logout-fade-duration": `${LOGOUT_FADE_DURATION_MS}ms`,
            } as React.CSSProperties}
        >
            <p className="logoutText">로그아웃 중...</p>
        </div>
    );
};

export default LogoutOverlay;

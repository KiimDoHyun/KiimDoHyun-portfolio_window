import client from "./client";

export const getCommitApi = () =>
    client.get(
        `https://api.github.com/repos/KiimDoHyun/KiimDoHyun-portfolio_window/commits`
    );

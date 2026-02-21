import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { RecoilRoot } from "recoil";

// Recoil 0.7.x는 React 19에서 제거된 구 internal API를 참조함.
// React 19는 __SECRET_INTERNALS → __CLIENT_INTERNALS 로 이름을 변경하고
// ReactCurrentDispatcher → H, ReactCurrentOwner → A 등으로 축약함.
// Recoil → Jotai 등으로 마이그레이션 시 이 polyfill 제거 가능.
const CLIENT_INTERNALS =
  React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
if (CLIENT_INTERNALS && !React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
  React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
    ReactCurrentDispatcher: {
      get current() {
        return CLIENT_INTERNALS.H;
      },
      set current(v) {
        CLIENT_INTERNALS.H = v;
      },
    },
    ReactCurrentBatchConfig: CLIENT_INTERNALS.T,
    ReactCurrentOwner: CLIENT_INTERNALS.A,
  };
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <RecoilRoot>
    <App />
  </RecoilRoot>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

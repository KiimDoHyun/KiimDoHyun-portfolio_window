import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./page/MainPage";
import SetCurTime from "./Setting/SetCurTime";
import SetDirectory from "./Setting/SetDirectory";

function App() {
    return (
        <div className="App">
            <SetCurTime />
            <SetDirectory />
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <Routes>
                    {/* <Route
                        element={<MainPage />}
                        path="/KiimDoHyun-portfolio_window"
                    /> */}
                    <Route element={<MainPage />} path="/" />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;

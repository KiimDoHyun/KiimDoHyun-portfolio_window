import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./page/MainPage";
import SetCurTime from "./Setting/SetCurTime";

function App() {
    return (
        <div className="App">
            <SetCurTime />
            <BrowserRouter>
                <Routes>
                    <Route element={<MainPage />} path="/" />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/AuthPage/LoginPage/LoginPage";
import { RegisterPage } from "../pages/AuthPage/RegisterPage/RegisterPage";
import DashBoardPage from "../pages/DashBoardPage/DashBoardPage";

export default function AppRouter() {
    return (
        <Routes>
            
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashBoardPage />} />
        </Routes>
    );
}

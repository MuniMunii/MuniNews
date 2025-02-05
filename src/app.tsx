import React ,{useState,useEffect}from "react";
import { Route, Routes } from "react-router-dom";
import { useTheme } from "./Frontend/context/context";
import Navbar from "./Frontend/component/navbar";
import Index from "./pages";
import NewsIndex from "./pages/newsIndex";
import "./root.css";
import RegisterForm from "./pages/auth/register";
import LoginForm from "./pages/auth/login";
import ResetPassword from "./pages/auth/resetPassword";
import ForgotPassword from "./pages/auth/forgotPassword";
function App() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <div
      className={`App transition duration-150 ${
        isLight ? "bg-white text-black" : " bg-darkTheme text-white"
      }`}
    >
      <Navbar/>
      <Routes>
        <Route path={"/newslist"} element={<NewsIndex />} />
        <Route path={"/login"} element={<LoginForm/>} />
        <Route path={"/register"} element={<RegisterForm/>} />
        <Route path={"/"} element={<Index />} />
        <Route path={'/forgot-password'} element={<ForgotPassword/>}/>
        <Route path={'/reset-password/:token'} element={<ResetPassword/>}/>
      </Routes>
    </div>
  );
}
export default App;

import React ,{useState,useEffect}from "react";
import { Route, Routes } from "react-router-dom";
import { useTheme } from "./Frontend/context/context";
import Navbar from "./Frontend/component/navbar";
import Index from "./Frontend/pages";
import NewsIndex from "./Frontend/pages/newsIndex";
import "./root.css";
import RegisterForm from "./Frontend/pages/auth/register";
import LoginForm from "./Frontend/pages/auth/login";
import ResetPassword from "./Frontend/pages/auth/resetPassword";
import ForgotPassword from "./Frontend/pages/auth/forgotPassword";
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

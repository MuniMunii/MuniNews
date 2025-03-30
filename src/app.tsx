import React, { useState, useEffect } from "react";
import { Route, Routes, useParams, Outlet, Navigate } from "react-router-dom";
import { useTheme, useUser, } from "./Frontend/context/context";
import Navbar from "./Frontend/component/navbar";
import Index from "./Frontend/pages";
import NewsIndex from "./Frontend/pages/newsIndex";
import "../src/root.css";
import RegisterForm from "./Frontend/pages/auth/register";
import LoginForm from "./Frontend/pages/auth/login";
import ResetPassword from "./Frontend/pages/auth/resetPassword";
import ForgotPassword from "./Frontend/pages/auth/forgotPassword";
import PageNotFound from "./Frontend/component/404Page";
import DashboardUser from "./Frontend/pages/user/dashboard";
import EditNews from "./Frontend/pages/user/editNews";
import LoadingComp from "./Frontend/component/loadingComp";
import DashboardAdmin from "./Frontend/pages/admin/dashboard";
import ReviewNews from "./Frontend/pages/admin/reviewNews";
import NewsList from "./Frontend/pages/admin/newsList";
import NewsListCategory from "./Frontend/pages/admin/newsListCategory";
import NewsPage from "./Frontend/pages/news";
import IndexNewsListCategory from "./Frontend/pages/newsListCategory";
import EditProfile from "./Frontend/pages/user/editProfile";
import UserInfo from "./Frontend/pages/userInfo";
function App() {
  const { theme } = useTheme();
  const isLight=theme==='light'
  const {user,isAuthenticated,role}=useUser()
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const ProtectedRoute = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
    if (!isAuthenticated) {
      return <Navigate to={"/login"} replace />;
    }
    return <Outlet />;
  };
  // Note 1: styling dashboard sama reconstruct dashboard component biar Lebih rapih
  // Note 2: Ubah semua IsLight const pake selector Dark
  // Note 3: Buat Page for news Index
  // Debugging
  // O Success X Failed
  // Register User (Validating,etc) O
  // Login O
  // Reset Password (Validating,Send Link to email,etc) O
  return (
    <div
      className={`App transition duration-150 ${
        isLight ? "bg-white text-black" : " bg-darkTheme text-white dark"
      }`}
    >
      <Navbar />
      <Routes>
        <Route path={"/"} element={<Index />} />
        <Route path={"/newslist"} element={<NewsIndex />} />
        <Route path={"/newslist/:category"} element={<IndexNewsListCategory/>}></Route>
        <Route path={"/read/:news_id"} element={<NewsPage />} />
        <Route path={"/user/:nama_user"} element={<UserInfo />} />
        <Route path={"/login"} element={<LoginForm />} />
        <Route path={"/register"} element={<RegisterForm />} />
        <Route path={"/forgot-password"} element={<ForgotPassword />} />
        <Route path={"/reset-password/:token"} element={<ResetPassword />} />
        <Route path={"/test-comp"} element={<LoadingComp error={null} />} />
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          {role === "journalist" ? (
            <>
              <Route path={`/${user}/dashboard`} element={<DashboardUser />} />
              <Route path={`/${user}/dashboard/edit-profile`} element={<EditProfile />} />
              <Route
                path={`/${user}/edit-news/:news_id`}
                element={<EditNews />}
              />
            </>
          ) : null}
          {role === "admin" ? (
            <>
            <Route path={`/${user}/dashboard`} element={<DashboardAdmin/>} />
            <Route path={`/${user}/dashboard/news`} element={<NewsList/>} />
            <Route path={`/${user}/dashboard/news/list/:status`} element={<NewsListCategory/>} />
            <Route path={`/review-news/:news_id`} element={<ReviewNews />} />
            </>
          ) : null}
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}
export default App;

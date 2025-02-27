import React, { useState, useEffect } from "react";
import { Route, Routes, useParams, Outlet, Navigate } from "react-router-dom";
import { useTheme } from "./Frontend/context/context";
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
function App() {
  // const [userRole, setUserRole] = useState<string>("");
  // const [isAuthenticatedState, setIsAuthenticatedState] = useState<boolean>(false);
  // const [loading, setIsLoading] = useState<boolean>(true);
  const { theme, user, isAuthenticated, role } = useTheme();
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const response = await fetch(`${baseURL}/auth/me`, {
  //         method: "get",
  //         credentials: "include",
  //       });
  //       if (response.ok) {
  //         const data: UserStatus = await response.json();
  //         setIsAuthenticatedState(data.isAuth);
  //         setUserRole(data.role);
  //       } else {
  //         setIsAuthenticatedState(false);
  //         setUserRole("");
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchUser();
  // }, []);
  const isLight = theme === "light";
  const ProtectedRoute = ({ isAuthenticated }: { isAuthenticated: string }) => {
    if (!isAuthenticated) {
      return <Navigate to={"/login"} replace />;
    }
    return <Outlet />;
  };
  // if(loading){
  //   return (
  //     <div className="flex justify-center items-center h-screen w-full">
  //     <p className="text-xl font-semibold">Loading...</p>
  //   </div>
  //   )
  // }
  // Note 1: styling dashboard sama reconstruct dashboard component biar Lebih rapih
  return (
    <div
      className={`App transition duration-150 ${
        isLight ? "bg-white text-black" : " bg-darkTheme text-white"
      }`}
    >
      <Navbar />
      <Routes>
        <Route path={"/"} element={<Index />} />
        <Route path={"/newslist"} element={<NewsIndex />} />
        <Route path={"/login"} element={<LoginForm />} />
        <Route path={"/register"} element={<RegisterForm />} />
        <Route path={"/forgot-password"} element={<ForgotPassword />} />
        <Route path={"/reset-password/:token"} element={<ResetPassword />} />
        <Route path={"/test-comp"} element={<LoadingComp error={null} />} />
        <Route element={<ProtectedRoute isAuthenticated={user} />}>
          {role === "journalist" ? (
            <>
              <Route path={`/${user}/dashboard`} element={<DashboardUser />} />
              <Route
                path={`/${user}/edit-news/:news_id`}
                element={<EditNews />}
              />
            </>
          ) : null}
          {role === "admin" ? (
            <Route path={`/${user}/dashboard`} element={<DashboardAdmin />} />
          ) : null}
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}
export default App;

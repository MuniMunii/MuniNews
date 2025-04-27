import React, { useState, useEffect, Suspense } from "react";
import { Route, Routes, useParams, Outlet, Navigate } from "react-router-dom";
import { useTheme, useUser } from "./Frontend/context/context";
import Navbar from "./Frontend/component/navbar";
import Index from "./Frontend/pages";
import "../src/root.css";
import RegisterForm from "./Frontend/pages/auth/register";
import LoginForm from "./Frontend/pages/auth/login";
import ResetPassword from "./Frontend/pages/auth/resetPassword";
import ForgotPassword from "./Frontend/pages/auth/forgotPassword";
import PageNotFound from "./Frontend/component/404Page";
import LoadingComp from "./Frontend/component/loadingComp";
import NewsPage from "./Frontend/pages/news";
import IndexNewsListCategory from "./Frontend/pages/newsListCategory";
import EditProfile from "./Frontend/pages/user/editProfile";
import UserInfo from "./Frontend/pages/userInfo";
function App() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { user, isAuthenticated, role } = useUser();
  useEffect(() => {
    let timer:NodeJS.Timeout;
    timer=setInterval(()=>{console.log('HI')},1000)
    const handlePageHide = (event: PageTransitionEvent) => {
      clearInterval(timer)
    };
    window.addEventListener("pagehide", handlePageHide);
    return () => {
      clearInterval(timer)
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);
  const ProtectedRoute = ({
    isAuthenticated,
  }: {
    isAuthenticated: boolean;
  }) => {
    if (!isAuthenticated) {
      return <Navigate to={"/login"} replace />;
    }
    return <Outlet />;
  };
  const DashboardAdmin = React.lazy(
    () => import("./Frontend/pages/admin/dashboard")
  );
  const DashboardUser = React.lazy(
    () => import("./Frontend/pages/user/dashboard")
  );
  const EditNews = React.lazy(() => import("./Frontend/pages/user/editNews"));
  const ReviewNews = React.lazy(
    () => import("./Frontend/pages/admin/reviewNews")
  );
  const NewsList = React.lazy(() => import("./Frontend/pages/admin/newsList"));
  const NewsListCategory = React.lazy(
    () => import("./Frontend/pages/admin/newsListCategory")
  );
  const NewsIndex = React.lazy(() => import("./Frontend/pages/newsIndex"));
  const PageNotFoundMemo = React.memo(PageNotFound);
  // Note 1: styling dashboard sama reconstruct dashboard component biar Lebih rapih
  // Note 2: Ubah semua IsLight const pake selector Dark
  // Note 3: Buat Page for news Index
  // Debugging
  // O Success X Failed
  // Register User (Validating,etc) O
  // Login O
  // Reset Password (Validating,Send Link to email,etc) O
  // Modal Component (editProfile,formAddNews,Logout,etc) O
  // Search User and News (With Filter and Includes) ) O
  // External API (Newsdata.io,WeatherAPI) O
  // News Page O
  // User Info Page (Fetching with param,Link Social Media) O
  // News List Category Page (Fetching,Skeleton Loading) O
  // Auto Save (Cleanup,Doesnt save when nothing is changed) O
  // Edit Profil (Cleanup Old Image if image change,Change Password etc,Modal Validation) O
  // Add News O
  // Publish And Reject News (Publish,Reject with reason and send to user email) O
  return (
    <div
      className={`App transition duration-150 ${
        isLight ? "bg-white text-black" : " bg-darkTheme text-white dark"
      }`}
    >
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route
          path="/newslist"
          element={
            <Suspense fallback={<LoadingComp error={null} />}>
              <NewsIndex />
            </Suspense>
          }
        />
        <Route
          path="/newslist/:category"
          element={
            <Suspense fallback={<LoadingComp error={null} />}>
              <IndexNewsListCategory />
            </Suspense>
          }
        />
        <Route
          path="/read/:news_id"
          element={
            <Suspense fallback={<LoadingComp error={null} />}>
              <NewsPage />
            </Suspense>
          }
        />
        <Route
          path="/user/:nama_user"
          element={
            <Suspense fallback={<LoadingComp error={null} />}>
              <UserInfo />
            </Suspense>
          }
        />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/test-comp" element={<LoadingComp error={null} />} />
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          {role === "journalist" && (
            <>
              <Route
                path={`/${user}/dashboard`}
                element={
                  <Suspense fallback={<LoadingComp error={null} />}>
                    <DashboardUser />
                  </Suspense>
                }
              />
              <Route
                path={`/${user}/dashboard/edit-profile`}
                element={<EditProfile />}
              />
              <Route
                path={`/${user}/edit-news/:news_id`}
                element={
                  <Suspense fallback={<LoadingComp error={null} />}>
                    <EditNews />
                  </Suspense>
                }
              />
            </>
          )}
          {role === "admin" && (
            <>
              <Route
                path={`/${user}/dashboard`}
                element={
                  <Suspense fallback={<LoadingComp error={null} />}>
                    <DashboardAdmin />
                  </Suspense>
                }
              />
              <Route
                path={`/${user}/dashboard/news`}
                element={
                  <Suspense fallback={<LoadingComp error={null} />}>
                    <NewsList />
                  </Suspense>
                }
              />
              <Route
                path={`/${user}/dashboard/news/list/:status`}
                element={
                  <Suspense fallback={<LoadingComp error={null} />}>
                    <NewsListCategory />
                  </Suspense>
                }
              />
              <Route
                path={`/review-news/:news_id`}
                element={
                  <Suspense fallback={<LoadingComp error={null} />}>
                    <ReviewNews />
                  </Suspense>
                }
              />
            </>
          )}
        </Route>
        <Route path="*" element={<PageNotFoundMemo />} />
      </Routes>
    </div>
  );
}
export default App;

import React, { ReactNode } from "react";
import { useTheme } from "../context/context";
import { useState, useEffect } from "react";
import { animate, AnimatePresence, motion } from "framer-motion";
import ToggleThemeButton from "./toggleTheme";
import { Link, Navigate, redirect } from "react-router-dom";
function Navbar() {
  const { theme, isWideScreen, assignUser, user,isAuthenticated} = useTheme();
  const [openNav, setOpenNav] = useState<boolean>(false);
  const [modalLogout, setModalLogout] = useState<boolean>(false);
  const isLight = theme === "light";
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    console.log(modalLogout);
  }, [modalLogout]);
  useEffect(() => {
    if (openNav || modalLogout) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [openNav,modalLogout]);
  const handleLogout = async () => {
    try {
      await fetch(`${baseURL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      assignUser("");
      window.location.reload();
      localStorage.removeItem("user");
      // localStorage.setItem("logout", Date.now().toString());
      // setTimeout(() => {
      //   localStorage.removeItem("logout");
      // }, 1000);
    } catch (error) {
      console.log("logout error di context", error);
    }
  };
  function LoginOrLogout({isAuthenticated}:{isAuthenticated:boolean}) {
    return (
      <>
        {isAuthenticated ? (
          <>
            {/* <Link to={"/Dashboard"}></Link> */}
            <motion.button
              className={`transition ${
                isLight ? "hover:border-b-pink-300" : "hover:border-b-blue-300"
              } border-b border-b-transparent`}
              onClick={() => {
                // handleLogout();
                setOpenNav(false);
                setModalLogout(true);
              }}
            >
              Logout
            </motion.button>
          </>
        ) : (
          <Link
            to={"/login"}
            onClick={() => setOpenNav(false)}
            className={`transition ${
              isLight ? "hover:border-b-pink-300" : "hover:border-b-blue-300"
            } border-b border-b-transparent`}
          >
            Login
          </Link>
        )}
      </>
    );
  }
  return (
    <>
      <AnimatePresence initial={false}>
        {modalLogout ? (
          <motion.div
            key={`modalLogout`}
            className={`bg-black/30 w-screen h-full rounded fixed z-20 flex justify-center items-center`}
          >
            <motion.div
              initial={{ opacity: 0.3, rotateY:5,rotateX:50,filter:'blur(4px)'}}
              animate={{ opacity: 1, rotateY:0,rotateX:0,filter:'blur(0)', }}
              exit={{ opacity: 0,  rotateY:10,rotateX:50,filter:'blur(4px)' }}
              transition={{
                duration: 0.25,
                ease: "easeIn",
              }}
              className={` min-w-[300px] max-w-[450px] h-40 p-2 rounded font-mono border uppercase select-none ${isLight?'bg-oceanBlue border-hotOrange text-white':'bg-slate-900 border-violet-900'}`}
            >
              <h1 className="font-semibold text-4xl">Confirm</h1>
              <p className={`border-b pb-2 ${isLight?'border-white':'border-b-white'}`}>Are You Sure Want To Logout?</p>
              <div className="flex justify-end items-center w-full mt-8 gap-2">
              <motion.button
                onClick={() => {
                  setModalLogout(false);
                }}
                className="px-3 py-1 rounded-md border border-white"
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={() => {
                  setModalLogout(false);
                  handleLogout();
                }}
                className="px-3 py-1 rounded-md bg-red-600"
              >
                Logout
              </motion.button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div
        className={`w-full h-20 px-6 flex justify-between relative items-center transition ${
          isLight ? "text-white bg-oceanBlue" : "text-white bg-transparent"
        }`}
      >
        {/* Logo */}
        <Link
          to={"/"}
          className="cursor-pointer laptop:text-4xl text-1xl h-fit  py-1 px-3 font-testLogo flex gap-2 select-none uppercase text-[#fffcf9]"
        >
          Muni<span className="bg-[#dd395f] px-2">News</span>
        </Link>
        {isWideScreen ? (
          <>
            <div className="w-full h-full flex px-4 items-center justify-end gap-5 text-xl uppercase font-mono">
              <p className="mr-auto">{user ? `Welcome ${user}!` : ""}</p>
              <Link
                to={"/"}
                className={`transition ${
                  isLight
                    ? "hover:border-b-pink-300"
                    : "hover:border-b-blue-300"
                } border-b border-b-transparent`}
              >
                Home
              </Link>
              <Link
                to={"/#about"}
                className={`transition ${
                  isLight
                    ? "hover:border-b-pink-300"
                    : "hover:border-b-blue-300"
                } border-b border-b-transparent`}
              >
                About
              </Link>
              <Link
                to={"/about"}
                className={`transition ${
                  isLight
                    ? "hover:border-b-pink-300"
                    : "hover:border-b-blue-300"
                } border-b border-b-transparent`}
              >
                News
              </Link>
              {isAuthenticated && (
                <Link
                  to={`${user}/dashboard`}
                  className={`transition ${
                    isLight
                      ? "hover:border-b-pink-300"
                      : "hover:border-b-blue-300"
                  } border-b border-b-transparent`}
                >
                  Dashboard
                </Link>
              )}
              <LoginOrLogout isAuthenticated={isAuthenticated}/>
              <ToggleThemeButton />
            </div>
          </>
        ) : (
          <>
            {" "}
            <motion.button
              onClick={() => setOpenNav(true)}
              className="font-mono uppercase text-2xl"
            >
              Menu
            </motion.button>
            <AnimatePresence initial={false}>
              {openNav && (
                <motion.div
                  initial={{ opacity: 0, y: -100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  key="navbar"
                  className={`bg-black/60 backdrop-blur-sm fixed top-0 left-0 w-screen h-full z-50 flex flex-col justify-center items-center font-mono uppercase ${
                    isLight ? "text-pink-300" : "text-blue-300"
                  }`}
                >
                  <motion.button
                    onClick={() => setOpenNav(false)}
                    className="text-white"
                  >
                    close
                  </motion.button>
                  <p>{user ? `Welcome ${user}!` : ""}</p>
                  <div className="flex flex-col text-5xl w-2/4 items-center gap-4">
                    <Link
                      to={"/"}
                      onClick={() => setOpenNav(false)}
                      className={`transition ${
                        isLight
                          ? "hover:border-b-pink-300"
                          : "hover:border-b-blue-300"
                      } border-b border-b-transparent`}
                    >
                      Home
                    </Link>
                    <LoginOrLogout isAuthenticated={isAuthenticated}/>
                    <Link
                      to={"/#about"}
                      onClick={() => setOpenNav(false)}
                      className={`transition ${
                        isLight
                          ? "hover:border-b-pink-300"
                          : "hover:border-b-blue-300"
                      } border-b border-b-transparent`}
                    >
                      About
                    </Link>
                    <Link
                      to={"/news"}
                      onClick={() => setOpenNav(false)}
                      className={`transition ${
                        isLight
                          ? "hover:border-b-pink-300"
                          : "hover:border-b-blue-300"
                      } border-b border-b-transparent`}
                    >
                      News
                    </Link>
                    {isAuthenticated && (
                      <Link
                      onClick={() => setOpenNav(false)}
                        to={`${user}/dashboard`}
                        className={`transition ${
                          isLight
                            ? "hover:border-b-pink-300"
                            : "hover:border-b-blue-300"
                        } border-b border-b-transparent`}
                      >
                        Dashboard
                      </Link>
                    )}
                    <ToggleThemeButton />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </>
  );
}
export default Navbar;

import React, { ReactNode } from "react";
import { useTheme } from "../context/context";
import { useState, useEffect } from "react";
import { animate, AnimatePresence, motion } from "framer-motion";
import ToggleThemeButton from "./toggleTheme";
import { Link } from "react-router-dom";
function Navbar() {
  const { theme, isWideScreen,user,assignUser,logout } = useTheme();
  const [openNav, setOpenNav] = useState<boolean>(false);
  const isLight = theme === "light";
  useEffect(() => {
    if (openNav) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [openNav]);
  function handleLogout(){
    logout()
    console.log('logout successfull User:'+user)
  }
  return (
    <div
      className={`w-full h-20 p-4 flex justify-between items-center transition ${
        isLight ? "text-blue-300" : "text-pink-300 bg-darkTheme"
      }`}
    >
      <h1 className="text-5xl">Title</h1>
      {isWideScreen ? (
        <>
          <p>{user}</p>
          {localStorage.getItem('user')?<button onClick={()=>{handleLogout()}}>Logout</button>:<Link to={'/login'}>Login</Link>}
          <ToggleThemeButton />
        </>
      ) : (
        <>
          {" "}
          <motion.button onClick={() => setOpenNav(true)}>Menu</motion.button>
          <AnimatePresence initial={false}>
            {openNav && (
              <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                key="navbar"
                className={`bg-black/60 backdrop-blur-sm fixed top-0 left-0 w-screen h-full z-50 flex flex-col justify-center items-center`}
              >
                <motion.button onClick={() => setOpenNav(false)}>
                  close
                </motion.button>
                <div className="flex flex-col text-5xl">
                  <Link to={"/"} onClick={() => setOpenNav(false)}>
                    Overview
                  </Link>
                  <Link to={"/Login"} onClick={() => setOpenNav(false)}>
                    test
                  </Link>
                  <Link to={"/"} onClick={() => setOpenNav(false)}>
                    test
                  </Link>
                  <Link to={"/"} onClick={() => setOpenNav(false)}>
                    test
                  </Link>
                  <Link to={"/"} onClick={() => setOpenNav(false)}>
                    test
                  </Link>
                  <ToggleThemeButton />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
export default Navbar;

import React, { ReactNode } from "react";
import { useTheme } from "../context/theme";
import { useState, useEffect } from "react";
import { animate, AnimatePresence, motion } from "framer-motion";
import ToggleThemeButton from "./toggleTheme";
function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [openNav, setOpenNav] = useState<boolean>(false);
  const isLight = theme === "light";
  useEffect(() => {
    if (openNav) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [openNav]);

  return (
    <div
      className={`w-full h-20 p-4 flex justify-between items-center ${
        isLight ? "text-blue-300" : "text-pink-300 bg-darkTheme"
      }`}
    >
      <h1 className="text-5xl">Title</h1>
      <ToggleThemeButton/>
      <motion.button onClick={() => setOpenNav(true)}>Menu</motion.button>
      <AnimatePresence initial={false}>
        {openNav && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0,}}
            transition={{ duration: 0.5 }}
            key="navbar"
            className={`bg-black/60 backdrop-blur-sm fixed top-0 left-0 w-screen h-full z-50 flex flex-col justify-center items-center`}
          >
            <motion.button onClick={() => setOpenNav(false)}>
              close
            </motion.button>
            <div className="flex flex-col text-5xl">
              <a>test</a>
              <a>test</a>
              <a>test</a>
              <a>test</a>
              <a>test</a>
              <ToggleThemeButton/>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default Navbar;

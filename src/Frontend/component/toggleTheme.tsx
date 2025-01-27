import {motion} from "framer-motion";
import { useTheme } from "../context/theme";
import { MdOutlineNightlight,MdOutlineLightMode } from "react-icons/md";
function ToggleThemeButton() {
    const {theme,toggleTheme}=useTheme();
    const isLight=theme==='light'
    return (
      <button
        className="toggle-container w-24 h-10 bg-pink-500/50 rounded-[50px] cursor-pointer flex p-2 items-center"
        style={{
          justifyContent: isLight ? "flex-start" : "flex-end",
        }}
        onClick={toggleTheme}
      >
        <motion.div
        key={'toggle-theme'}
          className={`toggle-handle w-1/2 h-full rounded-full flex items-center justify-center ${
            isLight ? "bg-darkTheme" : "bg-white"
          }`}
          layout
          transition={{
            type: "spring",
            visualDuration: 0.2,
            bounce: 0.2,
          }}
        >
          {isLight ? <MdOutlineNightlight className="text-base"/> : <MdOutlineLightMode className="text-base"/>}
        </motion.div>
      </button>
    );
  };
export default ToggleThemeButton;
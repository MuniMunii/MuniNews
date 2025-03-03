import { useEffect,useState } from "react";
import { useTheme,useScreen } from "../../context/context";
import testSVG from "../../assets/test_2.svg";
import { MdVerified } from "react-icons/md";
import {motion} from "framer-motion";
import '../../style/animation.css'
function IndexScreen(){
    const {isWideScreen}=useScreen()
    return (
        <div className={`w-screen text-black min-h-screen  relative flex items-center justify-between p-8 border-y border-b-black/50 border-t-black/50 bg-white dark:bg-darkTheme dark:border-b dark:border-b-gray-600 `}>
        <div className={`flex flex-col text-black dark:text-white  laptop:w-[40%] tablet:w-[60%] phone:w-4/5 max-w-[600px]`}>
        <h1 className={`tablet:text-8xl phone:text-7xl font-testTitle font-bold my-4 select-none`}><span className={`text-hotOrange dark:text-[#4597e4]`}>Read</span> & <span className={`text-mediumOrange dark:text-[#e65e80]`}>Write</span> News</h1>
        {/* <p className="my-2">Fast, Accurate and Trusted</p> */}
        <p className="my-2">A Place for journalist to Write and A place to read news from all around the world for free</p>
        <motion.a whileHover={{scale:1.1}} whileTap={{scale:0.8}} href="#news" className={`py-2 px-14 my-6 w-fit rounded-md font-semibold font-sans cursor-pointer bg-oceanBlue text-white dark:bg-pink-500 `}>Start Reading</motion.a>
        <div className={`flex flex-wrap gap-3`}>
          <p className="flex items-center gap-1"><MdVerified className={`fa-outline text-hotOrange dark:text-blue-500`}/>Fast</p>
          <p className="flex items-center gap-1"><MdVerified className={`fa-outline text-hotOrange dark:text-blue-500`}/>Accurate</p>
          <p className="flex items-center gap-1"><MdVerified className={`fa-outline text-hotOrange dark:text-blue-500`}/>Trusted</p>
        </div>
        </div>
        {isWideScreen?<img src={testSVG} alt="logo-index" loading="lazy" className=" w-1/2 h-screen select-none pointer-events-none"/>:''}
        </div>
    )
}
export default IndexScreen;
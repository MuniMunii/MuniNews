import { useEffect,useState } from "react";
import { useTheme } from "../../context/context";
import testSVG from "../../assets/test_2.svg";
import { MdVerified } from "react-icons/md";
import {motion} from "framer-motion";
import '../../style/animation.css'
function IndexScreen(){
    const {theme,isWideScreen}=useTheme()
    const isLight=theme==='light'
    // const [isWideScreen, setIsWideScreen] = useState(window.matchMedia('(min-width: 768px)').matches);
    // useEffect(() => {
    //   const mediaQuery = window.matchMedia('(min-width: 768px) and (min-height: 500px)');
    //   const handleMediaQueryChange = (event:MediaQueryListEvent) => {
    //     setIsWideScreen(event.matches);
    //   };
  
    //   mediaQuery.addEventListener('change', handleMediaQueryChange);
  
    //   return () => {
    //     mediaQuery.removeEventListener('change', handleMediaQueryChange);
    //   };
    // }, []);
    return (
        <div className={`w-screen text-black min-h-screen  relative flex items-center justify-between p-8 ${isLight?' border-y border-b-black/50 border-t-black/50 bg-white':'bg-darkTheme border-b border-b-slate-100/40'}`}>
        <div className={`flex flex-col ${isLight?'text-black':'text-white'} laptop:w-[40%] tablet:w-[60%] phone:w-4/5 max-w-[600px]`}>
        <h1 className={`tablet:text-8xl phone:text-7xl font-testTitle font-bold my-4 select-none`}><span className={`${isLight?'text-hotOrange':'text-[#4597e4]'}`}>Read</span> & <span className={`${isLight?'text-mediumOrange':'text-[#e65e80]'}`}>Write</span> News</h1>
        {/* <p className="my-2">Fast, Accurate and Trusted</p> */}
        <p className="my-2">A Place for journalist to Write and A place to read news from all around the world for free</p>
        <motion.a whileHover={{scale:1.1}} whileTap={{scale:0.8}} href="#news" className={`py-2 px-14 my-6 w-fit text-black rounded-md font-semibold font-sans cursor-pointer ${isLight?'bg-oceanBlue text-white':'bg-pink-500'}`}>Start Reading</motion.a>
        <div className={`flex flex-wrap gap-3`}>
          <p className="flex items-center gap-1"><MdVerified className={`fa-outline ${isLight?'text-hotOrange':'text-blue-500'}`}/>Fast</p>
          <p className="flex items-center gap-1"><MdVerified className={`fa-outline ${isLight?'text-hotOrange':'text-blue-500'}`}/>Accurate</p>
          <p className="flex items-center gap-1"><MdVerified className={`fa-outline ${isLight?'text-hotOrange':'text-blue-500'}`}/>Trusted</p>
        </div>
        </div>
        {isWideScreen?<img src={testSVG} alt="logo-index" loading="lazy" className=" w-1/2 h-screen select-none pointer-events-none"/>:''}
        </div>
    )
}
export default IndexScreen;
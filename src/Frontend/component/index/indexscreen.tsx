import { useEffect,useState } from "react";
import { useTheme } from "../../context/theme";
import testSVG from "../../assets/test.svg";
function IndexScreen(){
    const {theme}=useTheme()
    const isLight=theme==='light'
    const [isWideScreen, setIsWideScreen] = useState(window.matchMedia('(min-width: 768px)').matches);
    useEffect(() => {
      const mediaQuery = window.matchMedia('(min-width: 768px) and (min-height: 500px)');
      const handleMediaQueryChange = (event:MediaQueryListEvent) => {
        setIsWideScreen(event.matches);
      };
  
      mediaQuery.addEventListener('change', handleMediaQueryChange);
  
      return () => {
        mediaQuery.removeEventListener('change', handleMediaQueryChange);
      };
    }, []);
    return (
        <div className={`w-screen text-black min-h-screen  relative flex items-center justify-between p-8 bg-white ${isLight?' border-y border-b-black/50 border-t-black/50':'border-y border-b-white border-t-white'}`}>
        <div className="flex flex-col">
        <h1 className="tablet:text-8xl phone:text-7xl font-testTitle font-bold my-4"><span className={`${isLight?'text-hotOrange':'text-[#4597e4]'}`}>Read</span> & <span className={`${isLight?'text-mediumOrange':'text-[#e65e80]'}`}>Write</span> News</h1>
        <p className="my-2">Fast, Accurate and Trusted</p>
        <p className="my-2">A place for read news of all around the world</p>
        <a href="#news" className="py-2 px-14 my-6 w-fit bg-pink-500 text-black rounded-full font-semibold">Start Reading</a>
        </div>
        {isWideScreen?<img src={testSVG} alt="" className=" w-1/2 h-screen"/>:''}
        </div>
    )
}
export default IndexScreen;
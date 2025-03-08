import { useTheme } from "../context/context";
import { FaHeart } from "react-icons/fa";
function FooterComp() {
  return (
    <div
      className={`w-full h-fit flex justify-center p-6 relative bg-oceanBlue dark:border-t dark:bg-transparent dark:border-t-gray-600`}
    >
      <div className={`w-full h-full gap-x-40 gap-y-3 flex justify-evenly flex-wrap`}>
        {/* logo */}
      <h1 className="text-4xl h-fit  py-1 px-3 font-testLogo flex gap-2 pointer-events-none select-none uppercase text-[#fffcf9]">Muni<span className="bg-[#dd395f] px-2 text-[#fffcf9]">News</span></h1>
        <div className={`w-60 flex flex-col font-mono items-start justify-start text-white`}>
        <h1 className="text-5xl uppercase">About</h1>
            <div className="w-full flex justify-between gap-2">
                <div className="flex flex-col gap-1 text-xl">
                <a className="underline">Get Started</a>
                <a className="underline">Community</a>
                <a className="underline">About me</a>
                </div>
                <div className="flex flex-col gap-1 text-xl">
                <a className="underline">GH Repo</a>
                <a className="underline">LinkedIn</a>
                </div>
            </div>
        </div>
      </div>
      <p className={`absolute bottom-0 text-white font-mono flex items-center gap-2`}>Made with Love <span><FaHeart/></span></p>
    </div>
  );
}
export default FooterComp;

import React, { useState } from "react";
import "../root.css";
import useFetch from "../Frontend/hook/useFetch";
import Navbar from "../Frontend/component/navbar";
import { useTheme } from "../Frontend/context/theme";
import IndexScreen from "../Frontend/component/index/indexscreen";
import "../Frontend/style/animation.css";
import { MdEmail,MdVerified } from "react-icons/md";
function NewIndex() {
  const [newsSize, setNewsSize] = useState({
    page_size: 5,
  });
  const { theme } = useTheme();
  const isLight = theme === "light";
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const { value: userData, isLoading: isLoadingUser } = useFetch(
    `${baseURL}/user`,
    (data) => ({
      user: data,
    })
  );
  console.log(userData);
  return (
    <>
      <div
        className={`w-full h-full${
          isLight ? "bg-white text-black" : " bg-darkTheme text-white"
        }`}
      >
        <Navbar />
        <IndexScreen />
        <h1 id="news" className="text-center">
          News
        </h1>
        {/* <div className="card h-5 w-7"></div> */}
        <div
          className={`w-[90%] mx-auto flex flex-col items-center flex-wrap gap-5 select-none`}
        >
          <div
            className={`w-4/5 min-h-60 h-auto p-4 flex flex-wrap ${
              isLight ? "bg-lightOrange" : "bg-darkIndigo"
            }`}
          > 
            <div className="flex flex-col bg-slate-800 p-4 gap-3 my-2 tablet:w-[40%] tablet:max-w-[350px] phone:flex-grow">
              <h1 className="text-5xl">Start write your news here !</h1>
              <button className={`bg-slate-600`}>Register</button>
            </div>
            <div className="bg-slate-800 p-4 flex-grow my-2">
              <p className="uppercase">Let's Try</p>
              <p className={`flex items-center gap-1`}><MdVerified className={`${isLight?'text-hotOrange':'text-blue-500'}`}/>Free & Easy</p>
              <p className={`flex items-center gap-1`}><MdVerified className={`${isLight?'text-hotOrange':'text-blue-500'}`}/>Validated by administrator</p>
              <p className={`flex items-center gap-1`}><MdVerified className={`${isLight?'text-hotOrange':'text-blue-500'}`}/>Contribute to the website</p>
            </div>
            <div className="bg-slate-400 flex flex-col p-4 my-2 min-h-44 h-auto items-center tablet:mx-auto laptop:ml-auto phone:flex-grow tablet:w-fit tablet:flex-grow-0 cursor-pointer">
            <p>Still Have Question?</p>
            <p>Send us Email</p>
              <MdEmail className="text-darkTheme text-6xl"/>
              <a className=" w-full text-black">
                ramziakbar03311@gmail.com
              </a>
            </div>
          </div>
          {/* <div className="size-60 flex-shrink-0 card bg-black"></div>
          <div className="size-60 flex-shrink-0 card bg-black"></div>
          <div className="size-60 flex-shrink-0 card bg-black"></div>
          <div className="size-60 flex-shrink-0 card bg-black"></div>
          <div className="size-60 flex-shrink-0 card bg-black"></div>
          <div className="size-60 flex-shrink-0 card bg-black"></div>
          <div className="size-60 flex-shrink-0 card bg-black"></div>
          <div className="size-60 flex-shrink-0 card bg-black"></div>
          <div className="size-60 flex-shrink-0 card bg-black"></div>
          <div className="size-60 flex-shrink-0 card bg-black"></div>
          <div className="size-60 flex-shrink-0 card bg-black"></div>
          <div className="size-60 flex-shrink-0 card bg-black"></div>
          <div className="size-60 flex-shrink-0 card bg-black"></div>
          <div className="size-60 flex-shrink-0 card bg-black"></div>
          <div className="size-60 flex-shrink-0 card bg-black"></div>
          <div className="size-60 flex-shrink-0 card bg-black"></div>
          <div className="size-60 flex-shrink-0 card bg-black"></div>
          <div className="size-60 flex-shrink-0 card bg-black"></div>
          <div className="size-60 flex-shrink-0 card bg-black"></div>
          <div className="size-60 flex-shrink-0 card bg-black"></div>
          <div className="size-60 flex-shrink-0 card bg-black"></div> */}
          {/* <h1 className={`uppercase text-5xl h-fit`}>title</h1> */}
          {/* <NewsCurrentComp newsSize={newsSize.page_size}/>
        <button className="" onClick={()=>setNewsSize({page_size:newsSize.page_size+5})}>add 5 news</button> */}
        </div>
      </div>
    </>
  );
}
export default NewIndex;

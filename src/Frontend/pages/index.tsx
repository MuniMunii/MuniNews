import React, { useState,useRef } from "react";
import "../../root.css";
import useFetch from "../hook/useFetch";
import Navbar from "../component/navbar";
import { useTheme } from "../context/context";
import IndexScreen from "../component/index/indexscreen";
import "../style/animation.css";
import { MdEmail,MdVerified } from "react-icons/md";
import { Link } from "react-router-dom";
import FooterComp from "../component/footer";
import {motion} from "framer-motion";
function Index() {
  const [newsSize, setNewsSize] = useState({
    page_size: 5,
  });
  const { theme } = useTheme();
  const isLight = theme === "light";
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const { value: userData, isLoading: isLoadingUser } = useFetch(
    `${baseURL}/auth/user`,
    (data) => ({
      user: data,
    })
  );
  const containerRef=useRef(null)
  function ButtonMailTo({label,mailTo}:{label:string,mailTo:string}){
    return (
      <Link to={'#'}
      className={`w-full cursor-pointer mt-auto flex items-center text-center justify-center rounded hover:scale-105 transition ${isLight?'bg-oceanBlue text-white':' bg-pastelTosca text-black'}`}
      onClick={(e)=>{window.location.href=`mailto:${mailTo}`
      e.preventDefault()}}>
        {label}
      </Link>
    )
  }
  return (
    <>
      <div
        className={`w-full h-full`}
      >
        {/* <Navbar /> */}
        <IndexScreen />
        <h1 id="about" className="text-center">
          About
        </h1>
        {/* <div className="card h-5 w-7"></div> */}
        <div
          className={`w-[90%] mx-auto flex flex-col items-center flex-wrap gap-5 select-none`}
        >
          
          <div
            className={`w-4/5 min-h-60 relative z-20 ${
              isLight ? "bg-lightOrange shadow-cornerStampLight" : "bg-dark300 shadow-cornerStampDark"
            }`}
          > 
          <div className="absolute dotted top-0 left-0 -z-[1] w-full h-full"></div>
          <div className="h-auto p-4 flex flex-wrap z-10">
            <div className={`flex flex-col p-4 gap-3 my-2 tablet:w-[40%] tablet:max-w-[350px] phone:flex-grow font-testTitle ${isLight?'bg-lightOrange/60':'bg-dark300/60'}`}>
              <h1 className={`text-5xl leading-snug font-semibold `}>Start write your news here !</h1>
              <button className={`flex items-center text-center justify-center transition duration-200 rounded py-1 tracking-wider bg-opacity-50 ${isLight?'text-black hover:bg-opacity-100 bg-oceanBlue hover:text-white':' hover:bg-opacity-100 bg-pastelTosca hover:text-black'}`}>Register</button>
            </div>
            <div className={`p-4 flex-grow my-2 text-justify  ${isLight?'bg-lightOrange/60':'bg-dark300/60'}`}>
              <p className="uppercase tracking-wide font-semibold text-4xl mb-3">Let's Try</p>
              <p className={`flex items-center gap-1`}><MdVerified className={`text-blue-500`}/>Free & Easy</p>
              <p className={`flex items-center gap-1`}><MdVerified className={`text-blue-500`}/>Validated by administrator</p>
              <p className={`flex items-center gap-1`}><MdVerified className={`text-blue-500`}/>Contribute to the website</p>
            </div>
            <div className={`flex flex-col text-center p-4 my-2 min-h-44 h-auto items-center tablet:mx-auto laptop:ml-auto phone:flex-grow tablet:w-fit tablet:flex-grow-0 rounded ${isLight?'bg-[#FAF0CA] text-black':'bg-oceanBlue text-white'}`}>
            <p>Still Have Question?</p>
            <p>Send us Email</p>
              <MdEmail className={`${isLight?'text-darkTheme':'text-white'} outline-hotOrange text-6xl my-auto`}/>
              <ButtonMailTo mailTo="ramziakbar03311@gmail.com" label="Contact Me!"/>
            </div>
            </div>
          </div>
          {/* task besok */}
          <motion.div ref={containerRef} onViewportEnter={() => console.log('is entering')} onViewportLeave={() => console.log('is Leaving')} >intersecting</motion.div>
          <div className="bg-slate-900 w-32 h-24 mt-3">
          </div>
        </div>
      </div>
      <FooterComp/>
    </>
  );
}
export default Index;

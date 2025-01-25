import React, { useState } from "react";
import "../root.css";
import useFetch from "../Frontend/hook/useFetch";
import { useEffect } from "react";
import NewsCurrentComp from "../Frontend/component/index/newscurrentAPI";
import Navbar from "../Frontend/component/navbar";
import { useTheme } from "../Frontend/context/theme";
import IndexScreen from "../Frontend/component/index/indexscreen";
function NewIndex() {
  const [newsSize, setNewsSize] = useState({
    page_size: 5,
  });
  const {theme}=useTheme()
  const baseURL=process.env.REACT_APP_BACKEND_URL
  const {value:userData,isLoading:isLoadingUser}=useFetch(`${baseURL}/user`,(data=>({
    user:data
  })))
  console.log(userData);
  return (
    <>
      <div className={`w-full h-full ${theme==='light'?'bg-white text-black':' bg-darkTheme text-white'}`}>
        <Navbar/>
        <IndexScreen/>
        <h1 id="news" className="text-center">News</h1>
        <div className={`w-[90%] mx-auto flex phone:flex-col tablet:flex-row tablet:justify-between`}>
        {/* <h1 className={`uppercase text-5xl h-fit`}>title</h1> */}
        <NewsCurrentComp newsSize={newsSize.page_size}/>
        <button className="" onClick={()=>setNewsSize({page_size:newsSize.page_size+5})}>add 5 news</button>
        </div>
      </div>
    </>
  );
}
export default NewIndex;

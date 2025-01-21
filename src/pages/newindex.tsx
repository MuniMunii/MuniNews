import React, { useState } from "react";
import "../root.css";
import useFetch from "../Frontend/hook/useFetch";
import { useEffect } from "react";
function NewIndex() {
  const [newsSize, setNewsSize] = useState({
    page_size: 5,
  });
  const baseURL = "https://api.currentsapi.services/v1/latest-news";
  // api key di env
  const apiKey = "Hs1oONUVp1ZW40Oq0WjeURwhUAo_ALs3ERXD7HT9a_bl7Qgo";
  const newUrlParameter = new URLSearchParams({
    apiKey,
    page_size: String(newsSize.page_size),
  }).toString();
  const currentAPI = `${baseURL}?${newUrlParameter}`;
  const { value: newsData, isLoading } = useFetch(currentAPI, (data) => ({
    news: data.news as NewsItem[],
  }));
  const {value:userData}=useFetch(`${process.env.REACT_APP_BACKEND_URL}/hello`,(data=>({
    user:data
  })))
  console.log(newsData);
  console.log(userData)
  return (
    <>
      <div className="w-full h-screen bg-slate-950">
        <h1 className={`text-pink-100 uppercase text-5xl h-fit`}>title</h1>
        <button className="text-white" onClick={()=>setNewsSize({page_size:newsSize.page_size+5})}>add 5 news</button>
      </div>
    </>
  );
}
export default NewIndex;

import Navbar from "../component/navbar";
import { useState, useEffect } from "react";
import { useScreen } from "../context/context";
import FooterComp from "../component/footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import useFetch from "../hook/useFetch";
import "swiper/css";
import "swiper/css/pagination";
function NewsIndex() {
    const [currentNewsAPI,setCurrentNewsAPI]=useState<CurrentNews[]|undefined>()
    const [muniNews,setMuniNews]=useState<NewsKey[]|undefined>()
    const [query,setQuery]=useState<number>(1)
    const [error,setError]=useState<string|boolean>()
  const { isWideScreen } = useScreen();
  const baseURL=process.env.REACT_APP_BACKEND_URL
  useEffect(()=>{console.log(muniNews)},muniNews)
  useEffect(()=>{
    const fetchMuniNews=async()=>{
        try{
        const response=await fetch(`${baseURL}/news/query-news?pages=${query?query:1}`,{method:'Get'})
        const data=await response.json()
        if(response.ok){
            setMuniNews(data.news)
        }else{
            setError('Error try again')
        }
        }catch(error){console.log('error')}
    }
    fetchMuniNews()
  },[])
    const { value: newsData, isLoading: isLoadingCurrentAPI } = useFetch(
    `${baseURL}/news/currentnews`,
    (data) => ({
      news: data.news as CurrentNews[],
    })
  );
  return (
    <>
      <div className="border border-gray-600 w-[90%] h-full mx-auto flex my-3 relative">
        <div className="w-full max-w-[1000px] h-full border border-gray-600 p-2 mx-auto flex justify-start">
          <Swiper
            modules={[Pagination]}
            pagination={{ dynamicBullets: true }}
            className="mySwiper w-[90%] max-w-[700px] h-96 border border-gray-600"
          >
            <SwiperSlide
              style={{ width: "100%" }}
              className="!w-full bg-black"
            ></SwiperSlide>
            <SwiperSlide
              style={{ width: "100%" }}
              className="!w-full bg-white"
            ></SwiperSlide>
          </Swiper>
        </div>
        {isWideScreen && (
          <div className="w-1/3 h-screen border border-gray-600 sticky bg-black"></div>
        )}
      </div>
      <FooterComp />
    </>
  );
}
export default NewsIndex;

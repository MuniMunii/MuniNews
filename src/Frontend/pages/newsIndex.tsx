import Navbar from "../component/navbar";
import { useState, useEffect } from "react";
import { useScreen } from "../context/context";
import FooterComp from "../component/footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import useFetch from "../hook/useFetch";
import "swiper/css";
import "swiper/css/pagination";
import { FaRegNewspaper } from "react-icons/fa";
import LoadingComp from "../component/loadingComp";
import { Link } from "react-router-dom";
function NewsIndex() {
  const [muniNews, setMuniNews] = useState<NewsKey[] | undefined>();
  const [query, setQuery] = useState<number>(1);
  const [error, setError] = useState<string | boolean>();
  const [isLoading,setIsloading]=useState<boolean>(true)
  // const [randomNews,setRandomNews]=useState<number>()
  const { isWideScreen } = useScreen();
  const [imgError, setImgError] = useState<boolean>(false);
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    console.log(muniNews);
  }, [muniNews]);
  useEffect(() => {
    const fetchMuniNews = async () => {
      try {
        const response = await fetch(
          `${baseURL}/news/query-news?pages=${query ? query : 1}`,
          { method: "Get" }
        );
        const data = await response.json();
        if (response.ok) {
          setMuniNews(data.news);
        } else {
          setError("Error try again");
        }
      } catch (error) {
        console.log("error");
      }finally{setIsloading(false)}
    };
    fetchMuniNews();
  }, []);
  const { value: newsData, isLoading: isLoadingPublicAPI } = useFetch(
    `${baseURL}/news/publicnews`,
    (data) => ({
      news: data.results as PublicNews[] | undefined,
    })
  );
  function MuniNewsIndex() {
    return muniNews?.map((news, index) => (
      <div key={news.news_id} className=" w-full h-56 bg-black"></div>
    ));
  }
  // const RandomIndex=muniNews&&muniNews.length>0?Math.floor(Math.random()*(muniNews?.length??1)):1;
  return (
    <>
      <div className="w-full h-full mx-auto flex flex-col my-3 relative">
        <div className="w-[90%] mx-auto h-fit border border-gray-600 flex justify-between gap-11 ">
          <div className="w-full py-10">
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ dynamicBullets: true }}
            autoplay={{ delay: 4000, pauseOnMouseEnter: true }}
            className="mySwiper w-[90%] max-w-[700px] tablet:h-96 phone:h-72 border border-gray-600 rounded-md shadow-shadow_Dark dark:shadow-shadow_Light"
          >
            {isLoadingPublicAPI ? (
              <SwiperSlide className="!w-full h-full flex justify-center items-center">
                <LoadingComp error={null} />
              </SwiperSlide>
            ) : (
              newsData?.news?.map((news, index) => (
                <SwiperSlide
                  key={`current-news-${news.article_id}`}
                  className="!w-full h-full bg-cover relative group"
                >
                  <a
                    href={news.link}
                    className="cursor-pointer"
                    target="_blank"
                  >
                    <div className="absolute w-full top-0 left-0 z-20 text-white font-Poppins">
                      <div className="relative w-full opacity-0 transition duration-500 group-hover:opacity-100">
                        <div className="bg-black/40 absolute inset-0 gradient-mask-b-60 w-full"></div>
                        <div className="relative w-full p-2">
                          <p>
                            {news.description
                              ? news.description.trim().slice(0, 160) + "..."
                              : news.title}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute w-full bottom-0 right-0 z-20 text-white font-Poppins">
                      <div className="relative w-full">
                        <div className="bg-black/60 absolute inset-0 gradient-mask-t-60 w-full"></div>
                        <div className="relative w-full p-2 flex-col">
                          <p>{news.title}</p>
                          <p className="text-xs text-opacity-80">
                            Source: {news.source_name}
                          </p>
                        </div>
                      </div>
                    </div>
                    {!imgError && news.image_url ? (
                      <img
                        src={`${news.image_url}`}
                        className="object-fill absolute top-0 left-0 w-full h-full z-0"
                        onError={() => setError(true)}
                      />
                    ) : (
                      <div className="w-full h-full bg-black flex justify-center items-center text-5xl absolute top-0 left-0">
                        <FaRegNewspaper />
                      </div>
                    )}
                  </a>
                </SwiperSlide>
              ))
            )}
          </Swiper>
          </div>
          {/* side news */}
          {isWideScreen && (
            <div className="w-1/3 h-full border-x border-gray-600 sticky bg-white dark:bg-darkTheme flex flex-col p-2 gap-1 justify-evenly items-center font-Garramond">
              <h1 className="uppercase tracking-wider">Recent News</h1>
              {isLoading?<LoadingComp error={null}/>:muniNews?.map((news, index) => (
                <div className="w-full h-fit p-2 border-x border-gray-600 group cursor-pointer">
                  <p className="group-hover:underline">{news.name_news}</p>
                  <div className="w-full flex justify-start gap-2 text-xs pointer-events-none">
                    <p>Posted by: <span className="text-pink-600">{news.createdBy}</span></p>
                    <p className="border-l border-l-gray-600 pl-2 ">{news.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* news bawah /main*/}
        <div className="w-full h-fit border-y border-y-gray-600 flex items-center justify-evenly mt-5">
          <Link className="text-opacity-60 hover:text-opacity-100 transition duration-200" to={'politics/'}>Politic</Link>
          <Link className="text-opacity-60 hover:text-opacity-100 transition duration-200" to={'business/'}>Business</Link>
          <Link className="text-opacity-60 hover:text-opacity-100 transition duration-200" to={'science/'}>Science</Link>
          <Link className="text-opacity-60 hover:text-opacity-100 transition duration-200" to={'tech/'}>Tech</Link>
          <Link className="text-opacity-60 hover:text-opacity-100 transition duration-200" to={'sport/'}>Sport</Link>
          <Link className="text-opacity-60 hover:text-opacity-100 transition duration-200" to={'general/'}>General</Link>
        </div>
        <div className="w-full h-fit  bg-lightOrange my-5 dark:bg-dark300 py-7 px-7 flex phone:flex-col tablet:flex-row justify-between">
        <img src={`${baseURL}${muniNews?.[0].cover}`} className="tablet:w-[60%] phone:w-full max-h-[450px]"/>
          <div className="tablet:w-2/5 phone:w-full flex flex-col justify-center items-start p-3 gap-3">
          <p className="tablet:text-3xl phone:text-xl uppercase font-Garramond">{muniNews?.[0].name_news}</p>
          <p className="tablet:text-base">{muniNews?.[0].description}</p>
          <Link to={`/read/${muniNews?.[0].news_id}`} className="px-6 py-1 border transition duration-300 border-hotOrange hover:bg-hotOrange dark:border-pastelTosca dark:hover:text-black dark:hover:bg-pastelTosca">Read</Link>
          <div className="flex gap-2 text-xs">
            <p>Posted by: {muniNews?.[0].createdBy}</p>
            <p className="pl-2 border-l border-l-gray-600">{muniNews?.[0].category}</p>
          </div>
          </div>
        </div>
        <div className="w-[90%] mx-auto">
        <div className="w-[90%] mx-auto flex flex-col gap-1 p-1 border border-gray-600">
          <p className="uppercase">Only From MuniNews</p>
          <MuniNewsIndex />
        </div>
        </div>
      </div>
      <FooterComp />
    </>
  );
}

export default NewsIndex;

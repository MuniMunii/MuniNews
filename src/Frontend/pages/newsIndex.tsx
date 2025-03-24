import Navbar from "../component/navbar";
import { useState, useEffect } from "react";
import { useScreen } from "../context/context";
import FooterComp from "../component/footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import useFetch from "../hook/useFetch";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../style/swiper.css";
import { FaRegNewspaper } from "react-icons/fa";
import LoadingComp from "../component/loadingComp";
import { Link } from "react-router-dom";
import BannerNews from "../component/index/bannerNews";
import PageNotFound from "../component/404Page";
import { FaMagnifyingGlass } from "react-icons/fa6";
import SearchNews from "../component/index/searchNews";
import WeatherStatus from "../component/index/weatherStatus";
function NewsIndex() {
  const [muniNews, setMuniNews] = useState<NewsKey[] | undefined>();
  const [query, setQuery] = useState<number>(1);
  const [error, setError] = useState<string | boolean>();
  const [isLoading, setIsloading] = useState<boolean>(true);
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
        const response = await fetch(`${baseURL}/news/get-news`, {
          method: "Get",
        });
        const data = await response.json();
        if (response.ok) {
          setMuniNews(data.news);
        } else {
          setError("Error try again");
        }
      } catch (error) {
        console.log("error");
      } finally {
        setIsloading(false);
      }
    };
    fetchMuniNews();
  }, []);
  const { value: newsData, isLoading: isLoadingPublicAPI } = useFetch(
    `${baseURL}/news/publicnews`,
    (data) => ({
      news: data.results as PublicNews[] | undefined,
    })
  );
  function MuniNewsIndex({ tag }: { tag: Category }) {
    return isLoading?<div className="w-full tablet:max-w-52 h-fit border-b border-b-gray-600 pb-2 group flex flex-col gap-y-2">
      <div className="w-full h-5 rounded-full bg-gray-500 animate-pulse"></div>
      <div className="w-[90%] h-5 rounded-full bg-gray-500 animate-pulse"></div>
      <div className="w-1/2 h-5 rounded-full bg-gray-500 animate-pulse"></div>
    </div>:muniNews
      ?.filter((news) => news.category === tag && news.status === "published")
      .slice(0, 3)
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .map((news, index) => (
        <Link
          to={`/read/${news.news_id}`}
          key={news.news_id}
          className="w-full tablet:max-w-52 h-fit border-b border-b-gray-600 pb-2 group"
        >
          <p className="group-hover:underline">{news.name_news}</p>
          <div className="flex flex-row-reverse gap-1 justify-end text-sm">
            <p className="pl-1 border-l border-l-gray-600 break-page-all">
              {news.category}
            </p>
            <p className="text-blue-600">{news.createdBy}</p>
          </div>
          <p className="text-xs text-left">
            {news.updatedAt.replace(/T\d{2}:\d{2}:\d{2}\.\d{3}Z/, "")}
          </p>
        </Link>
      ));
  }
  // const RandomIndex=muniNews&&muniNews.length>0?Math.floor(Math.random()*(muniNews?.length??1)):1;
  return (
    <>
    <div className="w-72 h-12 flex justify-end items-center px-8 pt-2 ml-auto max-tablet:mx-auto relative">
  <SearchNews/>
</div>
      <div className="w-full h-full mx-auto flex flex-col my-3 relative">
        <div className="w-[90%] mx-auto h-fit border border-gray-600 rounded-md flex justify-between">
          <div className="w-full py-10 bg-gradient-to-t from-darkTheme to-violet-950">
            <Swiper
              modules={[Pagination, Autoplay, Navigation]}
              navigation={true}
              loop={true}
              pagination={{ dynamicBullets: true }}
              autoplay={{ delay: 4000, pauseOnMouseEnter: true }}
              className="mySwiper w-[90%] max-w-[800px] tablet:h-96 phone:h-72 rounded-md shadow-shadow_Dark dark:shadow-shadow_Light"
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
            <div className="w-1/3 h-full border-l border-gray-600 bg-gradient-to-t from-darkTheme to-oceanBlue text-white flex flex-col p-2 gap-1 justify-evenly items-center font-Garramond">
              <h1 className="uppercase tracking-widest border-b border-hotOrange dark:border-pastelTosca">
                Recent News
              </h1>
              {isLoading ? (
                <LoadingComp error={null} />
              ) : (
                muniNews
                  ?.filter((news) => news.status === "published")
                  .sort(
                    (a, b) =>
                      new Date(b.updatedAt).getTime() -
                      new Date(a.updatedAt).getTime()
                  )
                  .slice(0, 5)
                  .map((news, index) => (
                    <Link
                      to={`/read/${news.news_id}`}
                      key={`recent-news-${news.news_id}`}
                      className="w-full h-fit p-2 border-x border-gray-600 group cursor-pointer"
                    >
                      <p className="group-hover:underline">{news.name_news}</p>
                      <div className="w-full flex justify-start gap-2 text-xs pointer-events-none">
                        <p>
                          Posted by:{" "}
                          <span className="text-blue-600">
                            {news.createdBy}
                          </span>
                        </p>
                        <p className="border-l border-l-gray-600 pl-2 ">
                          {news.category}
                        </p>
                      </div>
                    </Link>
                  ))
              )}
            </div>
          )}
        </div>
        {/* news bawah /main*/}
        <div className="w-full h-fit border-y border-gray-600 flex items-center justify-evenly gap-3 flex-wrap mt-5 font-semibold font-Poppins">
          <Link
            className="text-black/60 hover:text-black/100 dark:text-white/60 dark:hover:text-white/100 transition duration-200"
            to={"politics/"}
          >
            Politic
          </Link>
          <Link
            className="text-black/60 hover:text-black/100 dark:text-white/60 dark:hover:text-white/100 transition duration-200"
            to={"business/"}
          >
            Business
          </Link>
          <Link
            className="text-black/60 hover:text-black/100 dark:text-white/60 dark:hover:text-white/100 transition duration-200"
            to={"science/"}
          >
            Science
          </Link>
          <Link
            className="text-black/60 hover:text-black/100 dark:text-white/60 dark:hover:text-white/100 transition duration-200"
            to={"tech/"}
          >
            Tech
          </Link>
          <Link
            className="text-black/60 hover:text-black/100 dark:text-white/60 dark:hover:text-white/100 transition duration-200"
            to={"sport/"}
          >
            Sport
          </Link>
          <Link
            className="text-black/60 hover:text-black/100 dark:text-white/60 dark:hover:text-white/100 transition duration-200"
            to={"general/"}
          >
            General
          </Link>
        </div>
        {/* news list */}
        <div className="w-[90%] h-fit mx-auto flex mt-5">
          {/* News */}
          <div
            className={`flex flex-col gap-3 ${
              isWideScreen ? "w-2/3" : "items-center w-full"
            }`}
          >
            {isLoading ? (
              <div className="w-full flex justify-between p-2 gap-2 border-b-2 border-b-hotOrange dark:border-b-pastelTosca">
                <div className="w-full flex flex-col gap-2">
                  <div className="bg-gray-500 w-full h-4 rounded-full animate-pulse"></div>
                  <div className="bg-gray-500 w-full h-4 rounded-full animate-pulse"></div>
                  <div className="bg-gray-500 w-full h-4 rounded-full animate-pulse"></div>
                </div>
                <div className="bg-gray-500 size-16 animate-pulse"></div>
              </div>
            ) : (
              muniNews?.sort(
                (a, b) =>
                  new Date(b.updatedAt).getTime() -
                  new Date(a.updatedAt).getTime()
              ).slice(0, 8).map((news, index) => (
                <Link
                to={`/read/${news.news_id}`}
                  key={`news-list-vertical-${news.news_id}`}
                  className="w-full flex justify-between gap-7 p-2 group items-center border-b-2 border-b-hotOrange dark:border-b-pastelTosca"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-xl group-hover:underline">{news.name_news}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{news.description}</p>
                    <div className="flex text-sm gap-2">
                      <p className="text-blue-600">{news.createdBy}</p>
                      <p className="pl-2 border-l border-l-gray-600">{news.category}</p>
                    </div>
                  </div>
                  <img
                    src={`${baseURL}${news.cover}`}
                    alt={`img-${news.name_news}`}
                    className="w-24 h-12"
                  />
                </Link>
              ))
            )}
          </div>
          {/* Weather */}
          {isWideScreen ? (
            <WeatherStatus/>
          ) : null}
        </div>
        <BannerNews
          baseURL={`${baseURL}`}
          muniNews={muniNews
            ?.filter((news) => news.status === "published")
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            )}
        />
        <div className="w-[90%] mx-auto">
          <div className="w-full flex flex-col gap-4 p-1 pb-3 font-Poppins">
            <p id="newstitle" className="uppercase text-center font-Garramond text-6xl">
              Only From MuniNews
            </p>
            <div className="w-full flex tablet:flex-row tablet:items-start phone:flex-col phone:items-center flex-wrap gap-2 justify-evenly">
              <div className="flex tablet:w-[45%] phone:w-full gap-x-2 gap-y-4 laptop:justify-start phone:justify-center flex-wrap">
                <div className="flex flex-col w-64 gap-3 items-center">
                  <div className="flex bg-[#B3DEE2] dark:bg-transparent flex-row-reverse items-center w-full justify-between px-3 py-1 border border-gray-600 rounded-full">
                    <Link
                      to={`general`}
                      className="text-xs text-black/60 dark:text-white/60 hover:underline"
                    >
                      More...
                    </Link>
                    <h1 className="font-semibold">General</h1>
                  </div>

                  <MuniNewsIndex tag="General" />
                </div>
                <div className="flex flex-col w-64 gap-3 items-center">
                  <div className="flex flex-row-reverse items-center w-full justify-between px-3 py-1 border border-gray-600 rounded-full">
                    <Link
                      to={`business`}
                      className="text-xs text-black/60 dark:text-white/60 hover:underline"
                    >
                      More...
                    </Link>
                    <h1 className="font-semibold">Business</h1>
                  </div>

                  <MuniNewsIndex tag="Business" />
                </div>
                <div className="flex flex-col w-64 gap-3 items-center">
                  <div className="flex flex-row-reverse items-center w-full justify-between px-3 py-1 border border-gray-600 rounded-full">
                    <Link
                      to={`sport`}
                      className="text-xs text-black/60 dark:text-white/60 hover:underline"
                    >
                      More...
                    </Link>
                    <h1 className="font-semibold">Sports</h1>
                  </div>

                  <MuniNewsIndex tag="Sport" />
                </div>
              </div>
              <div className="flex tablet:w-[45%] phone:w-full gap-x-2 gap-y-4 laptop:justify-start phone:justify-center flex-wrap">
                <div className="flex flex-col w-64 gap-3 items-center">
                  <div className="flex flex-row-reverse items-center w-full justify-between px-3 py-1 border border-gray-600 rounded-full">
                    <Link
                      to={`tech`}
                      className="text-xs text-black/60 dark:text-white/60 hover:underline"
                    >
                      More...
                    </Link>
                    <h1 className="font-semibold">Tech</h1>
                  </div>

                  <MuniNewsIndex tag="Tech" />
                </div>
                <div className="flex flex-col w-64 gap-3 items-center">
                  <div className="flex flex-row-reverse items-center w-full justify-between px-3 py-1 border border-gray-600 rounded-full">
                    <Link
                      to={`sciences`}
                      className="text-xs text-black/60 dark:text-white/60 hover:underline"
                    >
                      More...
                    </Link>
                    <h1 className="font-semibold">Sciences</h1>
                  </div>

                  <MuniNewsIndex tag="Sciences" />
                </div>
                <div className="flex flex-col w-64 gap-3 items-center">
                  <div className="flex flex-row-reverse items-center w-full justify-between px-3 py-1 border border-gray-600 rounded-full">
                    <Link
                      to={`politics`}
                      className="text-xs text-black/60 dark:text-white/60 hover:underline"
                    >
                      More...
                    </Link>
                    <h1 className="font-semibold">Politics</h1>
                  </div>
                  <MuniNewsIndex tag="Politics" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterComp />
    </>
  );
}

export default NewsIndex;

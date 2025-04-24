import { useState, useEffect, lazy,useMemo } from "react";
import { useScreen } from "../context/context";
import FooterComp from "../component/footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import useFetch from "../hook/useFetch";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../style/swiper.css";
import { FaRegNewspaper } from "react-icons/fa";
import LoadingComp from "../component/loadingComp";
import { Link } from "react-router-dom";
import BannerNews from "../component/index/bannerNews";
import { motion } from "framer-motion";
import SearchNews from "../component/index/searchNews";
import WeatherStatus from "../component/index/weatherStatus";
import LazyImageIntersection from "../component/lazyImageIntersection";
function NewsIndex() {
  const [error, setError] = useState<string | boolean>();
  const { isWideScreen } = useScreen();
  const [imgError, setImgError] = useState<boolean>(false);
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const { value: muniNews, isLoading: isLoading } = useFetch<NewsKey[]>(
    `/news/get-news`,
    (data) => data.news  as NewsKey[],
    "GET"
  );
  useEffect(() => {
    console.log(muniNews);
  }, [muniNews]);
  const { value: newsData, isLoading: isLoadingPublicAPI } = useFetch(
    `/news/publicnews`,
    (data) => ({
      news: data.results as PublicNews[] | undefined,
    }),"GET"
  );
  function MuniNewsIndex({ tag }: { tag: Category }) {
    return isLoading ? (
      <div className="w-full tablet:max-w-52 h-fit border-b border-b-gray-600 pb-2 group flex flex-col gap-y-2">
        <div className="w-full h-5 rounded-full bg-gray-500 animate-pulse"></div>
        <div className="w-[90%] h-5 rounded-full bg-gray-500 animate-pulse"></div>
        <div className="w-1/2 h-5 rounded-full bg-gray-500 animate-pulse"></div>
      </div>
    ) : (
      muniNews
        ?.filter((news) => news.category === tag && news.status === "published")
        .slice(0, 3)
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        .map((news, index) => (
            <div key={news.news_id} className="w-full tablet:max-w-52 h-fit border-b border-b-gray-600 pb-2">
              <Link
                to={`/read/${news.news_id}`}
                className="group"
              >
                <p className="group-hover:underline">{news.name_news}</p>
              </Link>
              <div className="flex flex-row-reverse gap-1 justify-end text-sm">
                <p className="pl-1 border-l border-l-gray-600 break-page-all">
                  {news.category}
                </p>
                <Link
                  to={`/user/${news.createdBy}`}
                  className="text-blue-600 hover:underline"
                >
                  {news.createdBy}
                </Link>
              </div>
              <p className="text-xs text-left">
                {news.updatedAt.replace(/T\d{2}:\d{2}:\d{2}\.\d{3}Z/, "")}
              </p>
            </div>
          
        ))
    );
  }
  const MemoizedSlide=useMemo(() => {
    return (
      newsData?.news?.map((news, index) => (
        <SwiperSlide
          key={`current-news-${news.article_id}-${index}`}
          className="!w-full h-full bg-cover relative group"
        >
          <a
            href={news.link}
            className="cursor-pointer group"
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
              <>
              <img
              src={`${news.image_url}`}
                // src={`${news.image_url}`}
                loading="lazy"
                alt={`img-${news.title}`}
                className="swiper-lazy object-cover size-full top-0 left-0 z-0 group-hover:scale-105 transition duration-200"
                onError={() => setError(true)}
              />
              <div className="swiper-lazy-preloader swiper-lazy-preloader-white" />
              </>
            ) : (
              <div className="w-full h-full bg-black flex justify-center items-center text-5xl absolute top-0 left-0">
                <FaRegNewspaper />
              </div>
            )}
          </a>
        </SwiperSlide>
      ))
    )
  },[newsData?.news])
  return (
    <>
      <div className="w-72 h-12 flex justify-end items-center px-8 pt-3 ml-auto max-tablet:mx-auto relative">
        <SearchNews />
      </div>
      <div className="w-full h-full mx-auto flex flex-col my-3 relative">
        <div className="w-[90%] mx-auto h-fit border border-gray-600 rounded-md flex justify-between">
          <div className="w-full py-10 bg-gradient-to-t from-darkTheme to-violet-950">
            <Swiper
              modules={[Pagination, Autoplay, Navigation]}
              // lazy={true}
              lazyPreloadPrevNext={5}
              lazyPreloaderClass="swiper-lazy-preloader"
              navigation={true}
              loop={true}
              pagination={{ dynamicBullets: true }}
              speed={500}
              autoplay={{ delay: 4000, pauseOnMouseEnter: true }}
              className="mySwiper w-[90%] max-w-[900px] tablet:h-96 phone:h-72 rounded-md shadow-shadow_Dark dark:shadow-shadow_Light"
            >
              {isLoadingPublicAPI ? (
                <SwiperSlide className="!w-full h-full flex justify-center items-center">
                  <LoadingComp error={null} />
                </SwiperSlide>
              ) : MemoizedSlide}
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
                      <div key={`recent-news-${news.news_id}-${index}`} className="w-full h-fit p-2 border-x border-gray-600">
                        <Link
                          to={`/read/${news.news_id}`}
                          className=" group "
                        >
                          <p className="group-hover:underline">
                            {news.name_news}
                          </p>
                        </Link>
                        <div className="w-full flex justify-start gap-2 text-xs">
                          <Link
                            to={`/user/${news.createdBy}`}
                            className="flex gap-1 items-center"
                          >
                            Posted by:{" "}
                            <span className="text-blue-600 hover:underline">
                              <p>{news.createdBy}</p>
                            </span>
                          </Link>
                          <p className="border-l border-l-gray-600 pl-2 ">
                            {news.category}
                          </p>
                        </div>
                      </div>
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
            to={"sciences/"}
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
              muniNews
                ?.filter((news) => news.verified)
                .sort(
                  (a, b) =>
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime()
                )
                .slice(0, 8)
                .map((news, index) => (
                  <div key={`news-list-vertical-${news.news_id}`} className="w-full flex flex-col justify-between  p-2 group items-center border-b-2 border-b-hotOrange dark:border-b-pastelTosca">
                  <div
                    className="group flex gap-7 phone:flex-col-reverse phone:justify-center tablet:flex-row tablet:items-center"
                  >
                    <div className="flex flex-col gap-1">
                      <Link
                    to={`/read/${news.news_id}`} className="text-xl group-hover:underline">
                        {news.name_news}
                      </Link>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {news.description}
                      </p>
                      <div className="w-full text-left flex text-sm gap-2">
                        <Link
                          to={`/user/${news.createdBy}`}
                          className="text-blue-600 hover:underline"
                        >
                          {news.createdBy}
                        </Link>
                        <p className="pl-2 border-l border-l-gray-600">
                          {news.category}
                        </p>
                      </div>
                    </div>
                    <LazyImageIntersection src={`${baseURL}${news.cover}`}
                      alt={`img-${news.name_news}`}
                      className="size-full tablet:max-w-36 tablet:max-h-24 object-cover"/>
                    {/* <img
                    loading="lazy"
                      src={`${baseURL}${news.cover}`}
                      alt={`img-${news.name_news}`}
                      width="96"
                      height="46"
                      sizes="(max-width: 600px) 48px, (max-width: 1200px) 96px, 192px"
                      className="size-full tablet:max-w-36 tablet:max-h-24 object-cover"
                    /> */}
                  </div>
                  </div>
                ))
            )}
          </div>
          {/* Weather */}
          {isWideScreen ? <WeatherStatus /> : null}
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
            <p
              id="newstitle"
              className="uppercase text-center font-Garramond text-6xl h-fit max-h-[120px]"
            >
              Only From MuniNews
            </p>
            <div className="w-full flex tablet:flex-row tablet:items-start phone:flex-col phone:items-center flex-wrap gap-2 justify-evenly">
              <div className="flex tablet:w-[45%] phone:w-full gap-x-2 gap-y-4 laptop:justify-start phone:justify-center flex-wrap">
                <div className="flex flex-col tablet:w-64 phone:w-full gap-3 items-center">
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
                <div className="flex flex-col tablet:w-64 phone:w-full gap-3 items-center">
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
                <div className="flex flex-col tablet:w-64 phone:w-full gap-3 items-center">
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
                <div className="flex flex-col tablet:w-64 phone:w-full gap-3 items-center">
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
                <div className="flex flex-col tablet:w-64 phone:w-full gap-3 items-center">
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
                <div className="flex flex-col tablet:w-64 phone:w-full gap-3 items-center">
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
        <motion.div
          className="w-full  h-32 bg-gradient-to-b from-lightOrange to-mediumOrange  dark:from-darkTheme dark:to-violet-950 flex justify-center items-center flex-col gap-2"
          initial={{ x: -100 }}
          whileInView={{ x: 0 }}
        >
          <p className="font-Poppins text-2xl uppercase text-center">
            Start Write your News/Article Now!
          </p>
          <div className="flex gap-2">
            <Link
              to={"/register"}
              className="border uppercase font-semibold border-hotOrange hover:bg-hotOrange dark:border-oceanBlue dark:hover:bg-oceanBlue px-4 py-1 transition duration-300 rounded-md"
            >
              Sign Up
            </Link>
            <Link
              to={"/login"}
              className="border uppercase font-semibold border-hotOrange hover:bg-hotOrange dark:border-oceanBlue dark:hover:bg-oceanBlue px-4 py-1 transition duration-300 rounded-md"
            >
              Login
            </Link>
          </div>
        </motion.div>
      </div>
      <FooterComp />
    </>
  );
}

export default NewsIndex;

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageNotFound from "../component/404Page";
import SkeletonIndexNews from "../component/SkeletonIndexNews";
import FooterComp from "../component/footer";
import LazyImageIntersection from "../component/lazyImageIntersection";
import { Helmet } from "react-helmet";
function IndexNewsListCategory() {
  const { category } = useParams();
  const [pages, setPages] = useState<number>(1);
  const [news, setNews] = useState<NewsKey[]>([]);
  const [removeSkeleton, setRemoveSkeleton] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const categoryList = [
    "Tech",
    "Business",
    "Sciences",
    "Politics",
    "General",
    "Sport",
  ];
  const startNews = 4;
  const endIndex = pages * 5;
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `${baseURL}/news/query-news-category/${
            category
              ? category?.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
              : ""
          }/${pages}`,
          { method: "get", credentials: "include" }
        );
        const data = await response.json();
        setNews((prev) => [...prev, ...data.news]);
      } catch (error) {
        console.log("error fethching data");
      } finally {
        setRemoveSkeleton(true); setIsLoading(false);
      }
    };
    fetchNews();
  }, [pages, category, pages]);
  if (
    !categoryList
      .map((cat) => cat.toLowerCase())
      .includes((category ?? "").toLowerCase())
  ) {
    return <PageNotFound />;
  }
  return (
    <>
    <Helmet>
          <title>News | {category?.toLocaleUpperCase()}</title>
    </Helmet>
      <div className="w-[90%] h-full my-3 mx-auto">
        {isLoading && !removeSkeleton ? (
          <SkeletonIndexNews />
        ) : (
          <>
            <h1 className="uppercase border-l-8 border-l-pink-600 dark:border-l-pastelTosca pl-2 text-6xl font-Garramond font-semibold">
              {category}
            </h1>
            <div className="w-full flex gap-2 tablet:flex-row phone:flex-col">
              <div
                className={`w-1/2 flex flex-col my-3 gap-3 tablet:w-1/2 phone:w-full`}
              >
                <Link
                  to={`/read/${news?.[0].news_id}`}
                  className="w-full h-full mx-auto border-b border-b-hotOrange dark:border-b-pastelTosca py-2 group"
                >
                  <div className="w-full h-96 overflow-hidden rounded-md">
                    <LazyImageIntersection 
                    lazy={false}
                      alt={`main-news-${news?.[0].name_news}`}
                      src={`${baseURL}${news?.[0].cover}`}
                      className="w-full group-hover:scale-105 transition-all duration-300"
                    />
                  </div>
                  <h3 className="font-Garramond text-4xl group-hover:underline">
                    {news?.[0].name_news}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {news?.[0].description}
                  </p>
                </Link>
              </div>
              <div
                className={`flex flex-col gap-2 py-2 tablet:w-1/2 phone:w-full`}
              >
                <p className="text-center text-3xl font-Garramond border-x-4 w-fit mx-auto border-x-pink-600 dark:border-x-pastelTosca px-2">
                  Editor Pick
                </p>
                {(news || [])?.slice(2, 4).map((newsItem, index) => {
                  const TimeFormat =
                    newsItem?.updatedAt &&
                    new Date(newsItem.updatedAt).getTime() <
                      new Date().getTime() - 24 * 60 * 60 * 1000;
                  const Time = TimeFormat
                    ? `${Math.floor(
                        (new Date().getTime() -
                          new Date(newsItem.updatedAt).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )} Days Ago`
                    : "Today";
                  return (
                    <div
                      key={`odd-${newsItem.name_news}-${index}`}
                      className="border-b border-b-hotOrange dark:border-b-pastelTosca flex flex-col py-2"
                    >
                      <Link
                        to={`/read/${newsItem.news_id}`}
                        className=" group flex tablet:flex-row phone:flex-col gap-2"
                      >
                        <img
                          loading="lazy"
                          alt={newsItem.name_news}
                          src={`${baseURL}${newsItem.cover}`}
                          className="w-32 h-24 self-center rounded-md"
                        ></img>
                        <div>
                          <p className="text-2xl font-Garramond uppercase group-hover:underline">
                            {newsItem.name_news}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {newsItem.description}
                          </p>
                        </div>
                      </Link>
                      <div className="flex gap-2 items-center text-sm">
                        <Link
                          to={`/user/${newsItem.createdBy}`}
                          className="pr-2 border-r border-r-gray-600 text-blue-600 hover:underline"
                        >
                          {newsItem.createdBy}
                        </Link>
                        <p>{Time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="w-full flex flex-col">
              {(news || [])
                ?.slice(startNews, endIndex)
                .map((newsItem, index) => {
                  const TimeFormat =
                    newsItem?.updatedAt &&
                    new Date(newsItem.updatedAt).getTime() <
                      new Date().getTime() - 24 * 60 * 60 * 1000;
                  const Time = TimeFormat
                    ? `${Math.floor(
                        (new Date().getTime() -
                          new Date(newsItem.updatedAt).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )} Days Ago`
                    : "Today";
                  return (
                    <div
                      key={`even-${newsItem.name_news}-${index}`}
                      className="border-b border-b-hotOrange dark:border-b-pastelTosca flex flex-col py-2"
                    >
                      <Link
                        to={`/read/${newsItem.news_id}`}
                        className=" group flex tablet:flex-row phone:flex-col gap-2"
                      >
                        <img
                          loading="lazy"
                          alt={`${newsItem.name_news}`}
                          src={`${baseURL}${newsItem.cover}`}
                          className="w-32 h-24 self-center rounded-md"
                        ></img>
                        <div>
                          <p className="text-2xl font-Garramond uppercase group-hover:underline">
                            {newsItem.name_news}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                            {newsItem.description}
                          </p>
                        </div>
                      </Link>
                      <div className="flex gap-2 items-center text-sm w-fit tablet:ml-[136px] phone:ml-0">
                        <Link
                          to={`/user/${newsItem.createdBy}`}
                          className="pr-2 border-r border-r-gray-600 text-blue-600 hover:underline"
                        >
                          {newsItem.createdBy}
                        </Link>
                        <p>{Time}</p>
                      </div>
                    </div>
                  );
                })}
              {(news || []).length % 5 !== 0 ? (
                <button className="flex items-center justify-center border border-lightOrange dark:border-blue-600 my-3 uppercase font-poppins font-semibold rounded-lg mx-auto py-2 px-9 cursor-not-allowed ">
                  No More News
                </button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  type="button"
                  onClick={() => setPages((prev) => prev + 1)}
                  className="flex items-center justify-center bg-lightOrange dark:bg-blue-600 my-3 uppercase font-poppins font-semibold rounded-lg mx-auto py-2 px-9"
                >
                  Show More
                </motion.button>
              )}
            </div>
          </>
        )}
      </div>
      <FooterComp />
    </>
  );
}
export default IndexNewsListCategory;

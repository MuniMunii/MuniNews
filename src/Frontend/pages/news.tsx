import { useState, useEffect } from "react";
import useFetch from "../hook/useFetch";
import { useParams } from "react-router-dom";
import { FaRegNewspaper } from "react-icons/fa";
import DOMPurify from "dompurify";
import LoadingComp from "../component/loadingComp";
import {motion,useScroll}from 'framer-motion'
function NewsPage() {
  const { news_id } = useParams();
  const [news, setNews] = useState<NewsKey | undefined>();
  const [error, setIsError] = useState<boolean | string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const {scrollYProgress}=useScroll()
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${baseURL}/news/get-news/${news_id}`, {
          method: "get",
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setNews(data.news);
        } else {
          setIsError(data.messages);
        }
      } catch (error) {
        setIsError("Error Try Again");
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews()
  }, [news_id]);
  const sanitizeContent = DOMPurify.sanitize(news?.content || "", {
    ALLOWED_TAGS: ["a", "ol", "li", "ul", "p", "b", "i", "strong", "em", "br"],
    ALLOWED_ATTR: ["href", "target", "rel", "data-list"],
  });
  if (isLoading) {
    return <LoadingComp error={error} />
  }
  return (
    <>
    <motion.div id="scroll-indicator" style={{scaleX:scrollYProgress,originX:0}} className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 to-pink-700 dark:from-blue-400 dark:to-blue-700"></motion.div>
      <div className={`tablet:w-[60%] w-3/4 h-full mx-auto text-center mt-4`}>
        <h1 className="text-5xl font-Garramond mb-3 uppercase">{news?.name_news}</h1>
        {news?.cover ? (
          <img
            src={`${baseURL}${news.cover}`}
            className="mx-auto w-full tablet:h-96 h-80 border border-gray-600/40"
          ></img>
        ) : (
          <div
            className={`bg-black flex-col text-white w-3/4 h-96 mx-auto rounded-lg my-4 flex justify-center items-center text-7xl min-h-12`}
          >
            <FaRegNewspaper />
          </div>
        )}
        <p className="italic tablet:w-1/2 w-3/4 mx-auto text-center my-3">
          {news?.description}
        </p>
        <article
          dangerouslySetInnerHTML={{ __html: sanitizeContent }}
          className="text-justify text leading-8 font-Poppins list-decimal"
        />
      </div>
    </>
  );
}
export default NewsPage;

import {  useUser } from "../../context/context";
import { Link } from "react-router-dom";
import { FaRegNewspaper } from "react-icons/fa";
import LazyImageIntersection from "../lazyImageIntersection";
function CardComponent({
  Tag,
  myNews,
}: {
  Tag: any;
  myNews: NewsKey[] | null;
}) {
  const {user}=useUser()
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const ImgCover = ({ cover }: { cover: string }) => {
    return (
      <LazyImageIntersection
      lazy={false}
        src={`${baseURL}${cover}`}
        className="cover object-cover rounded-md w-full h-28 border border-gray-600"
        alt={`cover-${cover}`}
      />
    );
  };
  if (Tag === "mynews") {
    return myNews?.length!==0?myNews?.map((news, index) => (
      <Link
        key={news.news_id}
        to={`/${user}/edit-news/${news.news_id}`}
        className={`bg-gradient-to-br border border-gray-600 bg-white dark:bg-[#0f1936] w-80 h-[400px] rounded-lg p-2 overflow-auto flex flex-col justify-evenly gap-1`}
      >
        {!news.cover ? (
          <div className="bg-white/75 backdrop-blur w-full h-28 rounded-md flex justify-center items-center text-6xl border border-gray-600 text-black">
            <FaRegNewspaper />
          </div>
        ) : (
          <ImgCover cover={news.cover} />
        )}
        <p
          className={`text-center break-words border border-gray-600 rounded-sm dark:bg-[#121e41] `}style={{overflowWrap:'anywhere'}}
        >
          {news.name_news}
        </p>
        <p
          className={`text-justify tracking-tight text-base border border-gray-600 rounded-sm p-2 dark:bg-[#121e41] break-words`}style={{overflowWrap:'anywhere'}}
        >
          {news.description}
        </p>
        <div className="flex gap-3">
          <p
            className={`text-center text-sm border border-gray-600 rounded-sm py-1 dark:bg-[#121e41]`}
          >
            Last Updated:{" "}
            {news.updatedAt.replace(/T\d{2}:\d{2}:\d{2}\.\d{3}Z/, "")}
          </p>
          <div className="flex gap-2 justify-around text-black">
            <p className="text-center py-[2px] px-3 rounded uppercase text-sm font-semibold flex justify-center items-center bg-red-400">
              {news.category}
            </p>
            <p
              className={`text-center py-[2px] px-3 rounded uppercase text-sm font-semibold flex justify-center items-center bg-green-400 ${
                news.status === "archived" ? "bg-sky-600" : ""
              } ${
                news.status === "published" ? "bg-green-600" : ""
              } ${news.status === "inreview" ? "bg-lightOrange" : ""} ${
                news.status === "cancelled" ? "bg-red-600" : ""
              }`}
            >
              {news.status}
            </p>
          </div>
        </div>
      </Link>
    )):<p className={`text-center text-black dark:text-white `}>Lets create your news</p>
  }
  return myNews?.filter(news=>news.status===Tag).length !== 0?myNews
    ?.filter((news) => news.status === Tag)
    ?.map((news, index) => (
      <Link
        key={news.news_id}
        to={`/${user}/edit-news/${news.news_id}`}
        className={`bg-gradient-to-br border border-gray-600 bg-white dark:bg-[#0f1936] w-80 h-[400px] rounded-lg p-2 overflow-auto flex flex-col justify-evenly gap-1`}
      >
        {!news.cover ? (
          <div className="bg-white/75 backdrop-blur w-full h-28 rounded-md flex justify-center items-center text-6xl border border-gray-600 text-black">
            <FaRegNewspaper />
          </div>
        ) : (
          <ImgCover cover={news.cover} />
        )}
        <p
          className={`text-center break-words border border-gray-600 rounded-sm dark:bg-[#121e41] `} style={{overflowWrap:'anywhere'}}
        >
          {news.name_news}
        </p>
        <p
          className={`text-justify tracking-tight text-base border border-gray-600 rounded-sm p-2 break-words`} style={{overflowWrap:'anywhere'}}
        >
          {news.description}
        </p>
        <div className="flex gap-3">
          <p
            className={`text-center text-sm border border-gray-600 rounded-sm py-1 `}
          >
            Last Updated:{" "}
            {news.updatedAt.replace(/T\d{2}:\d{2}:\d{2}\.\d{3}Z/, "")}
          </p>
          <div className="flex gap-2 justify-around text-black">
            <p className="text-center py-[2px] px-3 rounded uppercase text-sm font-semibold flex justify-center items-center bg-red-400">
              {news.category}
            </p>
            <p
              className={`text-center py-[2px] px-3 rounded uppercase text-sm font-semibold flex justify-center items-center bg-green-400 ${
                news.status === "archived" ? "bg-sky-600" : ""
              } ${
                news.status === "published" ? "bg-green-600" : ""
              } ${news.status === "inreview" ? "bg-lightOrange" : ""} ${
                news.status === "cancelled" ? "bg-red-600" : ""
              }`}
            >
              {news.status}
            </p>
          </div>
        </div>
      </Link>
    )):<p className={`text-center text-black dark:text-white `}>There are no <span className="uppercase">{Tag}</span> News</p>
}
export default CardComponent;

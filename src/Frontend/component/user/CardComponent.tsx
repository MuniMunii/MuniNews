import React from "react";
import { useTheme } from "../../context/context";
import { Link } from "react-router-dom";
import { FaRegNewspaper } from "react-icons/fa";
function CardComponent({ Tag, myNews }: { Tag: any; myNews: NewsKey[]|null }) {
  const { user, theme } = useTheme();
  const isLight = theme === "light";
  const baseURL=process.env.REACT_APP_BACKEND_URL
  const ImgCover=({cover}:{cover:string})=>{
    return <img src={`${baseURL}${cover}`} className="cover rounded-md w-full h-28" alt="cover-news"/>
  }
  if (Tag === "mynews") {
    return myNews?.map((news, index) => (
      <Link
        key={news.news_id}
        to={`/${user}/edit-news/${news.news_id}`}
        className={`bg-gradient-to-br ${
          index % 2 === 0
            ? `${
                isLight
                  ? "from-[#2178DD] to-[#F8CF6A] "
                  : "from-[#45A0EA] to-[#ECA9BB]"
              }`
            : `${
                isLight
                  ? "from-[#FA9372] to-[#B2EF91]"
                  : "from-[#95ECB0] to-[#F3F98A]"
              }`
        } w-80 h-96 rounded-lg p-2 overflow-auto flex flex-col justify-evenly`}
      >
        {!news.cover ? (
          <div className="bg-white/75 backdrop-blur w-full h-28 rounded-md flex justify-center items-center text-6xl">
            <FaRegNewspaper />
          </div>
        ) : (
          <ImgCover cover={news.cover}/>
        )}
        <p className="text-center break-words">{news.name_news}</p>
        <p className="text-justify text-base">{news.description}</p>
        <div className="flex">
          <p className="text-center text-sm">Last Updated: {news.updatedAt.replace(/T\d{2}:\d{2}:\d{2}\.\d{3}Z/,"")}</p>
          <div className="flex gap-2 justify-around">
            <p className="text-center py-[2px] px-3 rounded uppercase text-sm font-semibold flex justify-center items-center bg-red-400">
              {news.category}
            </p>
            <p className="text-center py-[2px] px-3 rounded uppercase text-sm font-semibold flex justify-center items-center bg-green-400">
              {news.status}
            </p>
          </div>
        </div>
      </Link>
    ));
  }
  return myNews
    ?.filter((news) => news.status === Tag)
    ?.map((news, index) => (
      <Link
        key={news.news_id}
        to={`/${user}/edit-news/${news.news_id}`}
        className={`bg-gradient-to-br ${
          index % 2 === 0
            ? `${
                isLight
                  ? "from-[#2178DD] to-[#F8CF6A] "
                  : "from-[#45A0EA] to-[#ECA9BB]"
              }`
            : `${
                isLight
                  ? "from-[#FA9372] to-[#B2EF91]"
                  : "from-[#95ECB0] to-[#F3F98A]"
              }`
        } w-80 h-96 rounded-lg p-2 overflow-auto flex flex-col justify-evenly`}
      >
        {!news.cover ? (
          <div className="bg-white/75 backdrop-blur w-full h-28 rounded-md flex justify-center items-center text-6xl">
            <FaRegNewspaper />
          </div>
        ) : (
          <ImgCover cover={news.cover}/>
        )}
        <p className="text-center break-words">{news.name_news}</p>
        <p className="text-justify text-base">{news.description}</p>
        <div className="flex">
          <p className="text-center text-sm">Last Updated: {news.updatedAt.replace(/T\d{2}:\d{2}:\d{2}\.\d{3}Z/,"")}</p>
          <div className="flex gap-2 justify-around">
            <p className="text-center py-[2px] px-3 rounded uppercase text-sm font-semibold flex justify-center items-center bg-red-400">
              {news.category}
            </p>
            <p className="text-center py-[2px] px-3 rounded uppercase text-sm font-semibold flex justify-center items-center bg-green-400">
              {news.status}
            </p>
          </div>
        </div>
      </Link>
    ));
}
export default CardComponent;

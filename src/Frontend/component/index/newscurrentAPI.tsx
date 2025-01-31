import React from "react";
import useFetch from "../../hook/useFetch";
import { useTheme } from "../../context/context";
import '../../../../src/root.css'
function NewsCurrentComp({ newsSize }: { newsSize: number }) {
  const { theme } = useTheme();
      const isLight=theme==='light'
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const { value: newsData, isLoading: isLoadingCurrentAPI } = useFetch(
    `${baseURL}/news/currentnews?page_size=${newsSize}`,
    (data) => ({
      news: data.news as NewsItem[],
    })
  );
  console.log(newsData?.news);
  return (
    <div className="w-full max-w-96 h-fit mx-auto my-6 p-3 bg-white rounded-md">
              <p className="text-black text-center">International News</p>
      <div
        className={`w-full h-full flex overflow-x-scroll scrollbar-thin gap-4 scrollbar-track-blue-300 ${isLight?'scrollbar-thumb-pink-400':'scrollbar-thumb-blue-950'}`}
      >
        {isLoadingCurrentAPI ? (
          <div className="w-full h-full rounded p-6 flex flex-col gap-2">
            <p className="w-1/2 bg-black/40 h-6 rounded-lg animate-pulse"></p>
            <p className="w-full bg-black/40 h-4 rounded-lg animate-pulse"></p>
            <p className="w-full bg-black/40 h-4 rounded-lg animate-pulse"></p>
            <p className="w-full bg-black/40 h-4 rounded-lg animate-pulse"></p>
            <p className="w-24 bg-black/40 h-4 rounded-lg animate-pulse mt-auto ml-auto"></p>
          </div>
        ) : (
          newsData?.news.map((news) => {
            return (
              <div key={news.id} className="flex-shrink-0 flex flex-col gap-2 h-full w-full p-2 text-wrap rounded text-black">
                <p className="text-justify">{news.description?news.description:'Error Occured (News not loaded)'}</p>
                <p>Author : {news.author}</p>
                <p>{news.published.replace(/\s\+\d{4}$/,"")}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
export default NewsCurrentComp;

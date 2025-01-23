import React from "react";
import useFetch from "../../hook/useFetch";
function NewsCurrentComp({ newsSize }: { newsSize: number }) {
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const { value: newsData, isLoading: isLoadingCurrentAPI } = useFetch(
    `${baseURL}/news/currentnews?page_size=${newsSize}`,
    (data) => ({
      news: data.news as NewsItem[],
    })
  );
  console.log(newsData?.news);
  return (
    <div className="w-full max-w-96 h-52 mx-auto my-6 p-3 bg-slate-900 rounded-md">
    <div className={`w-full h-full flex overflow-x-scroll gap-4`}>
      {newsData?.news.map((news) => {
        return <div className="flex-shrink-0 h-full w-60 p-2 text-wrap bg-slate-400 rounded">{news.title}</div>;
      })}
    </div>
    </div>
  );
}
export default NewsCurrentComp;

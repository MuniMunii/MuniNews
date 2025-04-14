import NavbarAdmin from "../../component/admin/navbar";
import SearchNews from "../../component/admin/searchNews";
import { useEffect,useState } from "react";
import useFetch from "../../hook/useFetch";
import '../../style/animation.css'
import NewsCard from "../../component/admin/newsCard";
import LoadingComp from "../../component/loadingComp";
import { Link } from "react-router-dom";
function NewsList() {
    const { value: news, isLoading: isLoading } = useFetch<NewsKey[]|null>(
      `/news/get-news`,
      (data) => data.news as NewsKey[]|null,
      "GET"
    );
  return (
    <>
      <div className="diagonal-pattern w-full h-full min-h-screen flex gap-7 font-Poppins">
        <NavbarAdmin />
        <div
          className={`w-full h-full p-5 flex rounded-bl-3xl rounded-tl-3xl border border-gray-600 bg-white dark:bg-darkTheme gap-3`}
        >
          <div className="dark:bg-[#0f1936] flex gap-3 h-full border rounded-md border-gray-600 p-3 w-full">
            <div className="w-2/6 p-4 gap-2  rounded-lg border dark:bg-[#121e41] border-gray-600 h-full flex flex-col justify-start items-center">
              <Link to={'list/published'} className="w-full h-fit dark:bg-[#121e41] group border border-gray-600 rounded-md flex justify-between items-center p-3">
              <div className="flex-col">
              <p>Published</p>
              <p className="text-xs text-black/50 dark:text-white/60 group-hover:underline">See More</p>
              </div>
                
                <div className="bg-blue-700 p-1 rounded-full size-6 flex justify-center items-center text-xs">
                  {news?.filter(news=>news.status==='published').length}
                </div>
              </Link>
              {isLoading?<LoadingComp error={null}/>:<NewsCard tag="published" news={news}/>}
            </div>
            <div className="w-2/6 p-4 gap-2 dark:bg-[#121e41] rounded-lg border border-gray-600 h-full flex flex-col justify-start items-center">
              <Link to={'list/inreview'} className="w-full h-fit dark:bg-[#121e41] group border border-gray-600 rounded-md flex justify-between items-center p-3">
              <div className="flex-col">
              <p>In Review</p>
              <p className="text-xs text-black/50 dark:text-white/60 group-hover:underline">See More</p>
              </div>
                
                <div className="bg-blue-700 p-1 rounded-full size-6 flex justify-center items-center text-xs">
                {news?.filter(news=>news.status==='inreview').length}
                </div>
              </Link>
              {isLoading?<LoadingComp error={null}/>:<NewsCard tag="inreview" news={news}/>}
            </div>
            <div className="w-2/6 p-4 gap-2 dark:bg-[#121e41] rounded-lg border border-gray-600 h-full flex flex-col justify-start items-center">
              <Link to={'list/all'} className="w-full h-fit dark:bg-[#121e41] group border border-gray-600 rounded-md flex justify-between items-center p-3">
              <div className="flex-col">
              <p>All News</p>
              <p className="text-xs text-black/50 dark:text-white/60 group-hover:underline">See More</p>
              </div>
                <div className="bg-blue-700 p-1 rounded-full size-6 flex justify-center items-center text-xs">
                {news?.filter(news=>news.status==='inreview'||news.status==="published").length}
                </div>
              </Link>
              {isLoading?<LoadingComp error={null}/>:<NewsCard tag="all" news={news}/>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default NewsList;

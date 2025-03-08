import NavbarAdmin from "../../component/admin/navbar";
import SearchNews from "../../component/admin/searchNews";
import { useEffect,useState } from "react";
import useFetch from "../../hook/useFetch";
import '../../style/animation.css'
import NewsCard from "../../component/admin/newsCard";
import LoadingComp from "../../component/loadingComp";
function NewsList() {
    const [news,setNews]=useState<NewsKey[]|null|undefined>()
    const [error,setError]=useState<boolean|null|String>()
    const [isLoading,setIsLoading]=useState<boolean>(true)
    const baseURL=process.env.REACT_APP_BACKEND_URL
    useEffect(()=>{console.log(news)},[news])
    useEffect(()=>{
        const fetchNews=async()=>{
            try{
                const response=await fetch(`${baseURL}/news/get-news`,{method:'GET',credentials:'include'})
                const data=await response.json()
                if(response.ok){
                    setNews(data.news)
                }else{setError(data.messages||'Error try again')}
            }catch(error){setError("error")}finally{setIsLoading(false)}
        }
        fetchNews()
    },[])
  return (
    <>
      <div className="diagonal-pattern w-full h-full min-h-screen flex gap-7 font-Poppins">
        <NavbarAdmin />
        <div
          className={`w-full h-full p-5 flex rounded-bl-3xl rounded-tl-3xl border border-gray-600 bg-white dark:bg-darkTheme gap-3`}
        >
          <div className="dark:bg-[#0f1936] flex gap-3 h-full border rounded-md border-gray-600 p-3 w-full">
            <div className="w-2/6 p-4 gap-2  rounded-lg border dark:bg-[#121e41] border-gray-600 h-full flex flex-col justify-start items-center">
              <div className="w-full h-12 dark:bg-[#121e41] border border-gray-600 rounded-md flex justify-between items-center p-2">
                <p>Published</p>
                <div className="bg-blue-700 p-1 rounded-full size-6 flex justify-center items-center text-xs">
                  {news?.filter(news=>news.status==='published').length}
                </div>
              </div>
              {isLoading?<LoadingComp error={null}/>:<NewsCard tag="published" news={news}/>}
            </div>
            <div className="w-2/6 p-4 gap-2 dark:bg-[#121e41] rounded-lg border border-gray-600 h-full flex flex-col justify-start items-center">
              <div className="w-full h-12 dark:bg-[#121e41] border border-gray-600 rounded-md flex justify-between items-center p-2">
                <p>In Review</p>
                <div className="bg-blue-700 p-1 rounded-full size-6 flex justify-center items-center text-xs">
                {news?.filter(news=>news.status==='inreview').length}
                </div>
              </div>
              {isLoading?<LoadingComp error={null}/>:<NewsCard tag="inreview" news={news}/>}
            </div>
            <div className="w-2/6 p-4 gap-2 dark:bg-[#121e41] rounded-lg border border-gray-600 h-full flex flex-col justify-start items-center">
              <div className="w-full h-12 dark:bg-[#121e41] border border-gray-600 rounded-md flex justify-between items-center p-2">
                <p>All News</p>
                <div className="bg-blue-700 p-1 rounded-full size-6 flex justify-center items-center text-xs">
                {news?.length}
                </div>
              </div>
              {isLoading?<LoadingComp error={null}/>:<NewsCard tag="all" news={news}/>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default NewsList;

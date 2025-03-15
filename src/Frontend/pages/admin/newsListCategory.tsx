import { useState,useEffect } from "react"
import NavbarAdmin from "../../component/admin/navbar"
import { useParams, useSearchParams } from "react-router-dom"
import LoadingComp from "../../component/loadingComp"
import { Link } from "react-router-dom"
import { FaUser } from "react-icons/fa"
import { BiCategory } from "react-icons/bi";
function NewsListCategory(){
    const [newsList,setNewsList]=useState<NewsKey[]|undefined>()
    const [isLoading,setIsLoading]=useState<boolean>(true)
    const [useSearchParam,setSearchParam]=useSearchParams()
    const pages=parseInt(useSearchParam.get('pages')??'1')
    const {status}=useParams()
    const baseURL=process.env.REACT_APP_BACKEND_URL
    useEffect(()=>{
        const fetchNews=async()=>{
            try{
                const response=await fetch(`${baseURL}/news/query-news/${status}?pages=${pages}`,{method:'get',credentials:'include'})
                const data=await response.json()
                if(response.ok){
                    setNewsList(data.news)
                }else{
                    console.log('error fetching')
                }
            }catch(error){console.log(error)}finally{setIsLoading(false)}
        }
        fetchNews()
    },[status,pages])
function handlePageChange(newPages:any){
    setSearchParam({pages:newPages})
}
    return (
        <div className="diagonal-pattern w-full h-full min-h-screen flex gap-7 font-Poppins">
            <NavbarAdmin/>
            <div className={`w-full h-full p-5 flex flex-col rounded-bl-3xl rounded-tl-3xl border border-gray-600 bg-white dark:bg-darkTheme`}>
                <div className="w-full h-fit flex flex-col items-center gap-5">
                    {newsList?.length===0 && <p>There are currently no {status==='inreview'?'News to Review':'News to Publish'}</p>}
                {isLoading?<LoadingComp error={null}/>:newsList?.map((news,index)=>(
                    <Link to={`/review-news/${news.news_id}`} key={news.news_id} className="w-10/12 h-126 rounded-lg group border border-gray-600 py-3 px-4 flex justify-between items-center gap-4">
                        <div className="w-1/5">
                        <img src={`${baseURL}${news.cover}`} className="size-full"></img>
                        </div>
                        <div className="w-full border-r border-r-gray-600 flex flex-col">
                        <p className="group-hover:underline">{news.name_news}</p>
                            <div className="flex gap-2">
                            <p className="text-xs flex items-center gap-2"><FaUser/> {news.createdBy}</p>
                            <p className="text-xs flex items-center gap-2 border-l border-l-gray-600 pl-2">{news.category}</p>
                            </div>
                        </div>
                        <p className={`flex items-center uppercase ${news.status==='published'?'bg-green-500':'bg-red-500'} rounded-md px-3 py-1`}>{news.status}</p>
                    </Link>
                ))}
                </div>
                <div className="flex gap-5 justify-center text-5xl">
                    {pages===1?<p className="cursor-not-allowed text-black/50 dark:text-white/50">{'<'}</p>:<button type="button" onClick={()=>handlePageChange(Math.max(pages-1))}>{'<'}</button>}
                    {newsList?.length!==5?<p className="cursor-not-allowed text-black/50 dark:text-white/50">{'>'}</p>:<button type="button" onClick={()=>handlePageChange(pages+1)}>{'>'}</button>}
                </div>
            </div>
        </div>
    )
}
export default NewsListCategory
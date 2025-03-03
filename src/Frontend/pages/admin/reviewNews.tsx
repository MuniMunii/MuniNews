import { useEffect,useState } from "react"
import { useParams } from "react-router-dom"
import LoadingComp from "../../component/loadingComp"
import { useTheme } from "../../context/context"
import { FaRegNewspaper } from "react-icons/fa";
import DOMPurify from "dompurify"
function ReviewNews(){
    const {news_id}=useParams()
    const [news,setNews]=useState<NewsKey>()
    const [isLoading,setIsLoading]=useState<boolean>(true)
    const [isError,setIsError]=useState<boolean|string|null>(null)
    const baseURL=process.env.REACT_APP_BACKEND_URL
    useEffect(()=>{
        const fetchNews=async ()=>{
            try{
            const response =await fetch(`${baseURL}/news/get-news/${news_id}`,{method:'get',credentials:'include'})
            const data=await response.json()
            if(response.ok){
                setNews(data.news)
                console.log(data.news.content)
            }else(
                setIsError(data.messages)
            )
        }catch(error){setIsError("error try again")}finally{setIsLoading(false)}
        }
        fetchNews()
    },[news_id])
    const sanitizeContent=DOMPurify.sanitize(news?.content||"")
    const handlePublish=async()=>{
        try{
            const response=await fetch(`${baseURL}/news/publish-news/${news_id}`,{credentials:'include',method:'post'})
            const data=await response.json()
            // Debugging
            console.log(data.messages)
        }catch(error){console.log('error')}
    }
    const handleCancel=async()=>{
        try{
        const response=await fetch(`${baseURL}/news/cancel-news/${news_id}`,{credentials:'include',method:'post'})
        const data=await response.json()
        // Debugging
        console.log(data.messages)
        }catch(error){console.log('error')}
    }
    if(isLoading){return <LoadingComp error={null}/>}
    return (
        <div className={`tablet:w-[60%] w-3/4 h-full mx-auto text-center`}>
            <h1 className="text-5xl font-Garramond mb-3">{news?.name_news}</h1>
            {news?.cover?<img src={`${baseURL}${news.cover}`} className="mx-auto w-full tablet:h-96 h-80 border border-gray-600/40"></img>:<div className={`bg-black flex-col text-white w-3/4 h-96 mx-auto rounded-lg my-4 flex justify-center items-center text-7xl min-h-12`}><FaRegNewspaper /></div>}
            <p className="italic tablet:w-1/2 w-3/4 mx-auto text-center my-3">{news?.description}</p>
            <div dangerouslySetInnerHTML={{__html:sanitizeContent}} className="text-justify text leading-8 font-Poppins"/>
            <div className="flex gap-2">
            <button onClick={handlePublish} className="border border-green-600 hover:bg-green-600 transition rounded-md px-3 py-1">Publish</button>
            <button onClick={handleCancel} className="border border-red-600 hover:bg-red-600 transition rounded-md px-3 py-1">Cancel</button>
            </div>
        </div>
    )
}
export default ReviewNews
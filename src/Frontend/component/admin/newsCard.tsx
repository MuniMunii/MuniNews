import { Link } from "react-router-dom"
import { useUser } from "../../context/context"
function NewsCard({news,tag}:{news:NewsKey[]|null|undefined,tag:statusNews|string}){
    if(tag==='all'){
        return news?.filter(news=>news.status==='inreview'||news.status==='published').sort((a,b)=>new Date(b.updatedAt).getTime()-new Date(a.updatedAt).getTime())?.slice(0,5).map((news,index)=>{return ( 
            <Link key={`news-${news.news_id}-${news.status}-${index}-all`} to={`/review-news/${news.news_id}`} className={`w-full h-fit max-h-32 border border-gray-600 rounded-md text-center px-3 py-2 ${index%2==0?'dark:bg-gradient-to-b dark:from-darkTheme dark:to-sky-900':'dark:bg-gradient-to-b dark:from-darkTheme dark:to-violet-950'} `}>
                <p>{news.name_news}</p>
                <p className="text-xs">Created At: {news.createdAt.replace(/T\d{2}:\d{2}:\d{2}\.\d{3}Z/, "")}</p>
                <p className={`py-1 px-3 uppercase w-fit mx-auto mt-2 rounded-md ${news.status==='published'?'bg-green-500':'bg-red-500'}`}>{news.status}</p>
            </Link>
        )})
    }
    return news?.filter(news=>news.status===tag).sort((a,b)=>new Date(b.updatedAt).getTime()-new Date(a.updatedAt).getTime()).slice(0,5)?.map((news,index)=>{return ( 
        <Link key={`news-${news.news_id}-${news.status}-${index}-${tag}`} to={`/review-news/${news.news_id}`} className={`w-full h-fit max-h-32 border border-gray-600 rounded-md text-center px-3 py-2 ${index%2==0?'dark:bg-gradient-to-b dark:from-darkTheme dark:to-sky-900':'dark:bg-gradient-to-b dark:from-darkTheme dark:to-violet-950'} `}>
            <p>{news.name_news}</p>
            <p className="text-xs">Created At: {news.createdAt.replace(/T\d{2}:\d{2}:\d{2}\.\d{3}Z/, "")}</p>
            <p className={`py-1 px-3 uppercase w-fit mx-auto mt-2 rounded-md ${news.status==='published'?'bg-green-500':'bg-red-500'}`}>{news.status}</p>
        </Link>
    )})
}
export default NewsCard
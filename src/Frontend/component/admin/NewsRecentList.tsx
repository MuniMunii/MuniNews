import { useTheme } from "../../context/context"
import { Link } from "react-router-dom"
function NewsRecentList({news}:{news:NewsKey[]|null}){
    return news?.filter(news=>news.status==='inreview'||news.verified).map((news,index)=>(
        <Link to={`/review-news/${news.news_id}`} key={news.news_id} className={`w-full h-fit py-2 px-3 border border-gray-600 dark:bg-[#182858] flex rounded-md items-center justify-between flex-wrap gap-1`}>
            <div className="flex-col flex w-2/5 break-all">
            <p>{news.name_news}</p>
            </div>
            <div className="flex-col flex">
            <p className={`text-sm text-green-800 dark:text-white`}>Posted By: {news.createdBy}</p>
            <p className={`text-xs text-blue-700 dark:text-white`}>Updated At: {news.updatedAt.replace(/T\d{2}:\d{2}:\d{2}\.\d{3}Z/,"")}</p>
            </div>
            <div>{news.verified?<p className="bg-green-500 py-1 px-3 rounded-md">Published</p>:<p className="bg-red-500 py-1 px-3 rounded-md cursor-pointer">Need Review</p>}</div>
        </Link>
    ))
}
export default NewsRecentList
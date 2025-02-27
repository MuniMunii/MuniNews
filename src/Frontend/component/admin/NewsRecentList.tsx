import { useTheme } from "../../context/context"

function NewsRecentList({news}:{news:NewsKey[]|null}){
    const {theme}=useTheme()
    const isLight=theme==='light'
    return news?.map((news,index)=>(
        <div key={news.news_id} className={`w-full h-fit py-2 px-3 border border-gray-600 ${isLight?'':'bg-[#182858] '} flex rounded-md items-center justify-between`}>
            <div className="flex-col flex">
            <p>{news.name_news}</p>
            </div>
            <div className="flex-col flex">
            <p className={`text-sm ${isLight?'text-green-800':''}`}>Posted By: {news.createdBy}</p>
            <p className={`text-xs ${isLight?'text-blue-700':''}`}>Updated At: {news.updatedAt.replace(/T\d{2}:\d{2}:\d{2}\.\d{3}Z/,"")}</p>
            </div>
            <div>{news.verified?<p className="bg-green-500 py-1 px-3 rounded-md">Published</p>:<p className="bg-red-500 py-1 px-3 rounded-md cursor-pointer">Need Review</p>}</div>
        </div>
    ))
}
export default NewsRecentList
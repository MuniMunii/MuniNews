import { Link } from "react-router-dom"
import LazyImageIntersection from "../lazyImageIntersection";
function BannerNews({muniNews,baseURL}:{muniNews:NewsKey[]|undefined,baseURL:string}){
  if (!muniNews || muniNews.length === 0) return null;
    return (
        <div className="w-full h-fit  bg-lightOrange my-5 dark:bg-dark300 py-7 px-7 flex phone:flex-col tablet:flex-row justify-evenly">
            <LazyImageIntersection lazy={false} alt={`${baseURL}${muniNews?.[0].cover}`} src={`${baseURL}${muniNews?.[0].cover}`} className="size-full max-h-[400px] max-w-[700px] rounded-md"/>
        <div className="tablet:w-2/5 phone:w-full flex flex-col justify-center items-start p-3 gap-3">
          <p className="tablet:text-3xl phone:text-xl uppercase font-Garramond">
            {muniNews?.[0].name_news}
          </p>
          <p className="tablet:text-base">{muniNews?.[0].description}</p>
          <Link
            to={`/read/${muniNews?.[0].news_id}`}
            className="px-6 py-1 border transition duration-300 border-hotOrange hover:bg-hotOrange dark:border-pastelTosca dark:hover:text-black dark:hover:bg-pastelTosca"
          >
            Read
          </Link>
          <div className="flex gap-2 text-xs">
            <p>
              Posted by:{" "}
              <Link to={`/user/${muniNews?.[0].createdBy}`} className="text-blue-600 hover:underline">{muniNews?.[0].createdBy}</Link>
            </p>
            <p className="pl-2 border-l border-l-gray-600">
              {muniNews?.[0].category}
            </p>
          </div>
        </div>
      </div>
    )
}
export default BannerNews
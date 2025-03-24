import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import PageNotFound from "../component/404Page";
type News={
    news:NewsKey[]
}
function IndexNewsListCategory() {
  const { category } = useParams();
  const [news, setNews] = useState<NewsKey[] | undefined>();
//   note fix ini nanti
  const TemporalNews:any[]=[];
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const categoryList = [
    "Tech",
    "Business",
    "Sciences",
    "Politics",
    "General",
    "Sport",
  ];
  useEffect(() => {
    TemporalNews.push(news)
    console.log(news);
  }, [news]);
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `${baseURL}/news/query-news-category/${
            category
              ? category?.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
              : ""
          }`,
          { method: "get", credentials: "include" }
        );
        const data = await response.json();
        if (response.ok) {
          setNews(data.news);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchNews();
  }, [category]);
  if (
    !categoryList
      .map((cat) => cat.toLowerCase())
      .includes((category ?? "").toLowerCase())
  ) {
    return <PageNotFound />;
  }
  return (
    <>
      <div className="w-[90%] h-full my-3 mx-auto">
        <h1 className="uppercase border-l-8 border-l-pink-600 dark:border-l-pastelTosca pl-2 text-6xl font-Garramond font-semibold">
          {category}
        </h1>
        <div className="w-full flex gap-2 tablet:flex-row phone:flex-col">
          <div className={`w-1/2 flex flex-col my-3 gap-3 tablet:w-1/2 phone:w-full`}>
            <Link to={`/read/${news?.[0].news_id}`} className="w-full h-full mx-auto border-b border-b-hotOrange dark:border-b-pastelTosca py-2 group">
              <img src={`${baseURL}${news?.[0].cover}`} className="w-full rounded-md"/>
              <h3 className="font-Garramond text-4xl group-hover:underline">{news?.[0].name_news}</h3>
              <p>{news?.[0].description}</p>
            </Link>
            {TemporalNews?.filter((news,index)=>index%2===0&&index!==0).map((newsItem, index) => 
            {
                const TimeFormat=newsItem?.updatedAt &&
                    new Date(newsItem.updatedAt).getTime() < new Date().getTime()
                      ? `${Math.floor(
                          (new Date().getTime() - new Date(newsItem.updatedAt).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )} Days Ago`
                      : ""
                return (
                <Link to={`/read/${newsItem.news_id}`} key={`even-${newsItem.name_news}`} className="border-b border-b-hotOrange dark:border-b-pastelTosca tablet:flex-row phone:flex-col flex gap-2 py-2 group">
                    <img src={`${baseURL}${newsItem.cover}`} className="w-32 h-24 self-center rounded-md"></img>
                    <div>
                    <p className="text-2xl font-Garramond uppercase group-hover:underline">{newsItem.name_news}</p>
                    <p>{newsItem.description}</p>
                    <div className="flex gap-2 items-center text-sm"><p className="pr-2 border-r border-r-gray-600 text-blue-600">{newsItem.createdBy}</p><p>{TimeFormat}</p></div>
                    </div>
            </Link>)})}
          </div>
          <div className={`flex flex-col gap-2 py-2 tablet:w-1/2 phone:w-full`}>
          {TemporalNews?.filter((news,index)=>index%2===1&&index!==0).map((newsItem, index) => 
            {
                const TimeFormat=newsItem?.updatedAt &&
                    new Date(newsItem.updatedAt).getTime() < new Date().getTime()
                      ? `${Math.floor(
                          (new Date().getTime() - new Date(newsItem.updatedAt).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )} Days Ago`
                      : ""
                return (
                <Link to={`/read/${newsItem.news_id}`} key={`odd-${newsItem.name_news}`} className="border-b border-b-hotOrange dark:border-b-pastelTosca flex tablet:flex-row phone:flex-col gap-2 py-2 group">
                    <img src={`${baseURL}${newsItem.cover}`} className="w-32 h-24 self-center rounded-md"></img>
                    <div>
                    <p className="text-2xl font-Garramond uppercase group-hover:underline">{newsItem.name_news}</p>
                    <p>{newsItem.description}</p>
                    <div className="flex gap-2 items-center text-sm"><p className="pr-2 border-r border-r-gray-600 text-blue-600">{newsItem.createdBy}</p><p>{TimeFormat}</p></div>
                    </div>
            </Link>)})}
          </div>
        </div>
      </div>
    </>
  );
}
export default IndexNewsListCategory;

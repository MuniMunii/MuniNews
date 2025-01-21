import React, { useState, useEffect } from "react";
import "./style/App.css";
import NewsCard from "./component/cardComp";
function App() {
  interface DataParam {
    news: NewsItem[];
    page: number;
  }
  interface URL {
    page_size: number;
    limit: number;
  }
  interface ErrorStatus {
    status: number;
    msg: string;
  }
  const [data, setData] = useState<DataParam|null>(null);
  const [url, setUrl] = useState<URL>({
    page_size: 5,
    limit: 10,
  });
  const [isLoading, setIsLoading] = useState<boolean>();
  const [errorMsg, setErrorMsg] = useState<ErrorStatus | null>(null);
  const [skeletonAnimation,setSkeletonAnimation]=useState<boolean|null>(null)
  const [dataLength,setDataLength]=useState<any|null>()
  // use Effect fetch data
  useEffect(() => {
    const baseURL = "https://api.currentsapi.services/v1/latest-news";
    // api key di env
    const apiKey = "Hs1oONUVp1ZW40Oq0WjeURwhUAo_ALs3ERXD7HT9a_bl7Qgo";
    const newUrlParameter = new URLSearchParams({
      apiKey,
      page_size: String(url.page_size),
      limit: String(url.limit),
    }).toString();
    const newURL = `${baseURL}?${newUrlParameter}`;
    console.log(newURL);
    setIsLoading(true);
    fetch(newURL)
      .then((response) => {
        if (!response.ok) {
          setErrorMsg({
            status: response.status,
            msg: response.statusText || "Error Unknown",
          });
          console.log("error");
        }
        return response.json();
      })
      .then((dataAPI) => {
        setData(({
          news: dataAPI.news,
          page: dataAPI.page,
        }));
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, [url.page_size]);
  // useEffect data check
  useEffect(() => {
    console.log(data);
  }, [data]);
  // useEffect animation skeleton
  useEffect(()=>{
    // setSkeletonAnimation(true)
    const timer = setTimeout(() => {
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          news: prev.news.map((item) =>
            item.notAnimated===undefined ? { ...item, notAnimated: false } : item
          ),
        };
      });
    }, 3000);
    return ()=> clearTimeout(timer)
  },[data?.news])
  const addPages = () => {
    setUrl((prevUrl) => ({ ...prevUrl, page_size: prevUrl.page_size + 5 }));
  };
  // const NewsCard: React.FC = () => {
  //   let skeletonAnimation:boolean=true;
  //   if(!data?.news)return null;
  //   function removeAnimation(){
  //     setTimeout(()=>skeletonAnimation=false,3000)
  //   }
  //   removeAnimation()
  //   return (
  //     <div className="flex w-[80%] flex-wrap justify-center">
  //       {data.news.map((data,index)=>(
  //         <div key={data.id} className={`w-60 h-fit p-4 ${skeletonAnimation?'animate-pulse bg-white':''}`}>{!skeletonAnimation?data.title:''}</div>
  //       ))}
  //     </div>
  //   )
  // };
  return (
    <div className="bg-slate-950 w-full min-h-screen flex flex-col items-center font-roboto box-border">
      <h1
        className={`text-pink-100 uppercase text-5xl h-fit ${
          isLoading ? "animate-pulse bg-pink-100/60" : ""
        }`}
      >
        title
      </h1>
      <button onClick={() => addPages()}>Add 5 page</button>
      <NewsCard data={data} animation={skeletonAnimation} dataLength={dataLength}/>
      {isLoading&&<h1 className="text-white text-7xl">IS LOADING</h1>}
    </div>
  );
}

export default App;

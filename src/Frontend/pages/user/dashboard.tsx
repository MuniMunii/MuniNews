import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../context/context";
import { animate, AnimatePresence, motion } from "framer-motion";
import AddNewsForm from "../../component/user/addNewsForm";
import CardComponent from "../../component/user/CardComponent";
import "../../style/animation.css"
import LoadingComp from "../../component/loadingComp";

function DashboardUser() {
  const [isActive, setIsActive] = useState<statusNews>('mynews');
  const [modalPopUp, setModalPopUp] = useState<boolean>(false);
  const [error, setError] = useState<string|boolean|null>(null);
  const [reload, setIsReload] = useState<boolean>(false);
  const [modalMakeNews, setModalMakeNews] = useState<boolean>(false);
  const [isLoading,setIsLoading]=useState<Boolean>(true)
  const [myNews, setMyNews] = useState<NewsKey[] | null>(null);
  useEffect(() => {
    console.log(modalMakeNews);
    if (modalMakeNews) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modalMakeNews]);
  useEffect(() => {
    const getNews = async () => {
      try{
      const response = await fetch(`${baseURL}/news/my-news`, {
        credentials: "include",
      });
      const data = await response.json();
      setMyNews(data.news);}catch(error){console.log(error)}finally{setIsLoading(false)}
    };
    getNews();
  }, [reload]);
  useEffect(() => {
    console.log(isActive);
  }, [isActive]);
  const { user, role, theme,isWideScreen } = useTheme();
  const isLight = theme === "light";
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  // const { value: userInfo, isLoading: isLoadingUserInfo } = useFetch(
  //   `${baseURL}/auth/me`,
  //   (data) => ({
  //     //   news: data.news as NewsItem[],
  //     me: data,
  //   })
  // );
  // console.log(userInfo?.me);
  const NavDashboard = () => {
    return (
      <div className={`w-full h-fit flex py-2 text-white font-mono px-4 justify-between items-center flex-wrap gap-y-2 border-b ${isLight?'border-b-black':'border-b-bwhite'}`}>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 font-Poppins tracking-wider transition duration-300   ${isLight?'text-black':'text-white'} rounded-md flex items-center justify-center ${
              isActive === "mynews" ? `text-opacity-100 ${isLight?'bg-lightOrange':'bg-blue-500'}` : `text-opacity-60 hover:text-opacity-100 ${isLight?'':''}`
            }`}
            onClick={() => setIsActive("mynews")}
          >
            MyNews
          </button>
          <button
            className={`px-3 py-1 font-Poppins tracking-wider transition duration-300  ${isLight?'text-black':'text-white'} rounded-md flex items-center justify-center ${
              isActive === "archived" ? `text-opacity-100 ${isLight?'bg-lightOrange':'bg-blue-500'}` : `text-opacity-60 hover:text-opacity-100 ${isLight?'':''}`
            }`}
            onClick={() => setIsActive("archived")}
          >
            Archived
          </button>
          <button
            className={`px-3 py-1 font-Poppins tracking-wider transition duration-300  ${isLight?'text-black':'text-white'} rounded-md flex items-center justify-center ${
              isActive === "published" ? `text-opacity-100 ${isLight?'bg-lightOrange':'bg-blue-500'}` : `text-opacity-60 hover:text-opacity-100 ${isLight?'':''}`
            }`}
            onClick={() => setIsActive("published")}
          >
            Published
          </button>
          <button
            className={`px-3 py-1 font-Poppins tracking-wider transition duration-300  ${isLight?'text-black':'text-white'} rounded-md flex items-center justify-center ${
              isActive === "inreview" ? `text-opacity-100 ${isLight?'bg-lightOrange':'bg-blue-500'}` : `text-opacity-60 hover:text-opacity-100 ${isLight?'':''}`
            }`}
            onClick={() => setIsActive("inreview")}
          >
            In Review
          </button>
          <button
            className={`px-3 py-1 font-Poppins tracking-wider transition duration-300  ${isLight?'text-black':'text-white'} rounded-md flex items-center justify-center ${
              isActive === "cancelled" ? `text-opacity-100 ${isLight?'bg-lightOrange':'bg-blue-500'}` : `text-opacity-60 hover:text-opacity-100 ${isLight?'':''}`
            }`}
            onClick={() => setIsActive("cancelled")}
          >
            Cancelled
          </button>
        </div>
        {/* <a className=" cursor-pointer" onClick={() => setIsReload(!reload)}>
          <IoReload />
        </a> */}
        <motion.button
          className="px-2 py-1 bg-gradient-to-br from-green-400 to-violet-400 text-black/80 rounded-md cursor-pointer"
          onClick={() => setModalMakeNews(true)}
        >
          Add News +
        </motion.button>
      </div>
    );
  };

  return (
    <>
    <div className="diagonal-pattern">
      <div className="mx-auto w-[90%] max-w-[800px] h-screen flex flex-col laptop:flex-row-reverse laptop:w-full laptop:max-w-full overflow-hidden">
        <div
          className={`laptop:block laptop:w-1/3 flex bg-white items-center gap-3 p-4 border border-gray-600`}
        >
          <div className="bg-black size-32 rounded-full"></div>
          <p className="text-black">{user}</p>
        </div>
        <div className={`h-full border ${isLight?'bg-white border-slate-500':'bg-darkTheme border-slate-500'} w-full laptop:w-3/4 laptop:max-w-[850px] laptop:mx-auto`}>
        <div className={`laptop:h-[90%] phone:h-[67%]`}>
          <NavDashboard />
          <div className={`p-4 text-black h-full w-full overflow-auto scrollbar-thin scrollbar-thumb-rounded-[10px] ${isLight?'scrollbar-thumb-violet-950' :'scrollbar-thumb-white text-white'} scrollbar-track-slate-300/40 flex flex-wrap gap-2 justify-center`}>
          {isLoading&&<LoadingComp error={error}/>}
            {isActive === "mynews"
              ?<CardComponent Tag='mynews' myNews={myNews}/>
              : null}
            {isActive === "archived"
              ? <CardComponent Tag="archived" myNews={myNews}/>
              : null}
            {isActive === "cancelled"
              ? <CardComponent Tag="cancelled" myNews={myNews}/>
              : null}
              {isActive === "inreview"
              ? <CardComponent Tag="inreview" myNews={myNews}/>
              : null}
              {isActive === "published"
              ? <CardComponent Tag="published" myNews={myNews}/>
              : null}
          </div>
        </div>
        </div>
      </div>
      </div>
      {/* modal PopUp */}
      <AnimatePresence initial={false}>
        {modalPopUp ? (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 w-full z-40 flex justify-center"
          >
            <div className="rounded-b-lg bg-slate-50 p-3 w-1/3 mx-auto text-center text-black uppercase">
              <p
                onClick={() => setModalPopUp(false)}
                className="text-red-500 text-left cursor-pointer w-fit"
              >
                X
              </p>
              <p>{error}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      {/* modal form make news */}
      <AnimatePresence initial={false}>
        {modalMakeNews ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`w-screen h-full flex justify-center items-center fixed font-mono `}
          >
            <div
              className={`size-[400px] p-4 rounded-lg ${
                isLight
                  ? "shadow-cornerStampLight bg-lightOrange"
                  : "shadow-cornerStampDark bg-darkTheme text-white"
              }`}
            >
              <motion.button
                onClick={() => setModalMakeNews(false)}
                className="text-red-600 font-sans font-semibold text-2xl"
              >
                X
              </motion.button>
              <AddNewsForm
                setModalMakeNews={setModalMakeNews}
                setModalPopUp={setModalPopUp}
                setError={setError}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
export default DashboardUser;

import { useEffect, useState } from "react";
import { useTheme } from "../../context/context";
import useFetch from "../../hook/useFetch";
import { IoReload } from "react-icons/io5";
import { redirect } from "react-router-dom";
import { animate, AnimatePresence, motion } from "framer-motion";
import AddNewsForm from "../../component/user/addNewsForm";
import { Link } from "react-router-dom";
import { FaRegNewspaper } from "react-icons/fa";
function DashboardUser() {
  const [isActive, setIsActive] = useState<string>("about");
  const [modalPopUp, setModalPopUp] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [reload, setIsReload] = useState<boolean>(false);
  const [modalMakeNews, setModalMakeNews] = useState<boolean>(false);
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
      const response = await fetch(`${baseURL}/news/my-news`, {
        credentials: "include",
      });
      const data = await response.json();
      setMyNews(data.news);
    };
    getNews();
  }, [reload]);
  useEffect(() => {
    console.log(isActive);
  }, [isActive]);
  const { user, role, theme, isAuthenticated } = useTheme();
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
      <div className="w-full h-fit bg-[#F1515E] flex py-2 text-white font-mono px-4 justify-between items-center flex-wrap gap-y-2">
        <div className="flex flex-wrap gap-y-2">
          <button
            className={`px-3 pb-3 transition duration-100 hover:border-b hover:border-b-white ${
              isActive === "about" ? "border-b border-b-white" : ""
            }`}
            onClick={() => setIsActive("about")}
          >
            About
          </button>
          <button
            className={`px-3 pb-3 transition duration-100 hover:border-b hover:border-b-white ${
              isActive === "mynews" ? "border-b border-b-white" : ""
            }`}
            onClick={() => setIsActive("mynews")}
          >
            MyNews
          </button>
          <button
            className={`px-3 pb-3 transition duration-100 hover:border-b hover:border-b-white ${
              isActive === "archived" ? "border-b border-b-white" : ""
            }`}
            onClick={() => setIsActive("archived")}
          >
            Archived
          </button>
          <button
            className={`px-3 pb-3 transition duration-100 hover:border-b hover:border-b-white ${
              isActive === "cancelled" ? "border-b border-b-white" : ""
            }`}
            onClick={() => setIsActive("cancelled")}
          >
            Cancelled
          </button>
        </div>
        <a className=" cursor-pointer" onClick={() => setIsReload(!reload)}>
          <IoReload />
        </a>
        <motion.button
          className="px-2 py-1 bg-black rounded-md cursor-pointer"
          onClick={() => setModalMakeNews(true)}
        >
          Add News +
        </motion.button>
      </div>
    );
  };

  return (
    <>
      <div className=" mx-auto w-[90%] max-w-[800px] h-screen flex flex-col laptop:flex-row-reverse laptop:w-full laptop:max-w-full overflow-hidden">
        <div
          className={`laptop:block laptop:w-1/3 flex bg-white items-center gap-3 p-4 ${isLight?'border-l border-l-black':''}`}
        >
          <div className="bg-black size-32 rounded-full"></div>
          <p className="text-black">{user}</p>
        </div>
        <div className="laptop:h-[90%] phone:h-[67%] w-full laptop:w-3/4 laptop:max-w-[750px] laptop:mx-auto">
          <NavDashboard />
          <div className={`p-4 text-black h-full w-full overflow-auto scrollbar-thin ${isLight?'scrollbar-thumb-violet-950' :'scrollbar-thumb-white'} scrollbar-track-slate-300/40 flex flex-wrap gap-2 justify-center`}>
          {isActive==='about'?<p className="text-center">testing</p>:null}
            {isActive === "mynews"
              ? myNews?.map((news, index) => {
                  return (
                    <Link
                    key={news.news_id}
                      to={`/${user}/edit-news/${news.news_id}`}
                      className={`bg-gradient-to-br ${index %2===0?`${isLight?'from-[#2178DD] to-[#F8CF6A] ':'from-[#45A0EA] to-[#ECA9BB]'}`:`${isLight?'from-[#FA9372] to-[#B2EF91]':'from-[#95ECB0] to-[#F3F98A]'}`} w-80 h-96 rounded-lg p-2 overflow-hidden flex flex-col justify-evenly`}
                    >
                      {!news.cover ? (
                        <div className="bg-white/75 backdrop-blur w-full h-28 rounded-md flex justify-center items-center text-6xl"><FaRegNewspaper/></div>
                      ) : (
                        <img src="" alt="img-cover" />
                      )}
                      <p className="text-center">{news.name_news}</p>
                      <p className="text-justify text-base">{news.description}</p>
                      <div className="flex">
                      <p className="text-center text-sm">Last Updated: {news.updatedAt}</p>
                      <div className="flex gap-2 justify-around">
                      <p className="text-center py-[2px] px-3 rounded uppercase text-sm font-semibold flex justify-center items-center bg-red-400">{news.category}</p>
                      <p className="text-center py-[2px] px-3 rounded uppercase text-sm font-semibold flex justify-center items-center bg-green-400">{news.status}</p></div>
                      </div>
                    </Link>
                  );
                })
              : null}
            {isActive === "archived"
              ? myNews
                  ?.filter((news) => news.status === "archived")
                  .map((news) => {
                    return (
                      <Link to={`/${user}/edit-news/${news.news_id}`}>
                        {news.name_news}
                      </Link>
                    );
                  })
              : null}
            {isActive === "archived"
              ? myNews
                  ?.filter((news) => news.status === "canceled")
                  .map((news) => {
                    return (
                      <Link to={`/${user}/edit-news/${news.news_id}`}>
                        {news.name_news}
                      </Link>
                    );
                  })
              : null}
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

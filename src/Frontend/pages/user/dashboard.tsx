import { useEffect, useState } from "react";
import { useUser } from "../../context/context";
import {  AnimatePresence, motion } from "framer-motion";
import AddNewsForm from "../../component/user/addNewsForm";
import CardComponent from "../../component/user/CardComponent";
import "../../style/animation.css"
import LoadingComp from "../../component/loadingComp";
import { Link } from "react-router-dom";
import { CiMenuKebab } from "react-icons/ci";
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";
import {IoPerson}from"react-icons/io5" 
import useFetch from "../../hook/useFetch";
function DashboardUser() {
  const [isActive, setIsActive] = useState<statusNews>('mynews');
  const [modalPopUp, setModalPopUp] = useState<boolean>(false);
  const [error, setError] = useState<string|boolean|null>(null);
  const [reload, setIsReload] = useState<boolean>(false);
  // const [userState,setUserState]=useState<Userkey>()
  const [modalMakeNews, setModalMakeNews] = useState<boolean>(false);
  // const [isLoading,setIsLoading]=useState<Boolean>(true)
  // const [myNews, setMyNews] = useState<NewsKey[] | null>(null);
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const {user,role}=useUser()
  const { value: myNews, isLoading: isLoading } = useFetch<NewsKey[]|null>(
    `/news/my-news`,
    (data) => data.news as NewsKey[]|null,
    "GET"
  );
  const { value: userState, isLoading: userIsLoading } = useFetch<Userkey>(
    `/user/get-user/${user}`,
    (data) => data.user as Userkey,
    "GET"
  );
  useEffect(() => {
    console.log(modalMakeNews);
    if (modalMakeNews) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modalMakeNews]);
  useEffect(() => {
    console.log(isActive);
  }, [isActive]);
  const NavDashboard = () => {
    return (
      <div className={`w-full h-fit flex py-2 text-white font-mono px-4 justify-between items-center flex-wrap gap-y-2 border-b border-b-gray-600 `}>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 font-Poppins tracking-wider transition duration-300 text-black dark:text-white   rounded-md flex items-center justify-center ${
              isActive === "mynews" ? `text-opacity-100 bg-light-Orange dark:bg-blue-600 ` : `text-opacity-60 hover:text-opacity-100 dark:text-opacity-60 dark:hover:text-opacity-100`
            }`}
            onClick={() => setIsActive("mynews")}
          >
            MyNews
          </button>
          <button
            className={`px-3 py-1 font-Poppins tracking-wider transition duration-300  text-black dark:text-white rounded-md flex items-center justify-center ${
              isActive === "archived" ? `text-opacity-100 bg-light-Orange dark:bg-blue-600 ` : `text-opacity-60 hover:text-opacity-100 dark:text-opacity-60 dark:hover:text-opacity-100`
            }`}
            onClick={() => setIsActive("archived")}
          >
            Archived
          </button>
          <button
            className={`px-3 py-1 font-Poppins tracking-wider transition duration-300  text-black dark:text-white rounded-md flex items-center justify-center ${
              isActive === "published" ? `text-opacity-100 bg-light-Orange dark:bg-blue-600 ` : `text-opacity-60 hover:text-opacity-100 dark:text-opacity-60 dark:hover:text-opacity-100 `
            }`}
            onClick={() => setIsActive("published")}
          >
            Published
          </button>
          <button
            className={`px-3 py-1 font-Poppins tracking-wider transition duration-300  text-black dark:text-white rounded-md flex items-center justify-center ${
              isActive === "inreview" ? `text-opacity-100 bg-light-Orange dark:bg-blue-600 ` : `text-opacity-60 hover:text-opacity-100 dark:text-opacity-60 dark:hover:text-opacity-100 `
            }`}
            onClick={() => setIsActive("inreview")}
          >
            In Review
          </button>
          <button
            className={`px-3 py-1 font-Poppins tracking-wider transition duration-300  text-black dark:text-white rounded-md flex items-center justify-center ${
              isActive === "cancelled" ? `text-opacity-100 bg-light-Orange dark:bg-blue-600 ` : `text-opacity-60 hover:text-opacity-100 dark:text-opacity-60 dark:hover:text-opacity-100 `
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
      <div className="mx-auto w-[90%] max-w-[800px] laptop:h-screen phone:h-full flex flex-col laptop:flex-row-reverse laptop:w-full laptop:max-w-full overflow-hidden">
        <div
          className={`laptop:block laptop:w-1/3 laptop:pr-8 flex-col bg-white dark:bg-darkTheme items-center gap-2 p-4 border border-gray-600`}
        >
          <div className="flex items-center gap-2 border-b border-gray-600 pb-2 relative">
            <Link to={'edit-profile'} className="py-1 px-3 rounded-md dark:bg-blue-600 bg-lightOrange absolute right-0 top-0 flex items-center justify-center gap-1">Edit<CiMenuKebab className="text-black"/></Link>
          {userState?.image?<img alt="user-profile-picture" src={`${baseURL}${userState?.image}`} className="size-32 rounded-full object-cover"></img>:<div className="bg-black size-32 rounded-full flex justify-center items-center"><IoPerson/></div>}
          <p className="">{user}</p>
          </div>
          <p className="text-center italic font-Poppins text-sm py-2 border-b border-b-gray-600 break-words"style={{overflowWrap:"anywhere"}}>{userState?.description?userState.description:'This user not created description yet'}</p>
          <div className="flex gap-2 text-xl w-full justify-center py-2">
            {userState?.facebook?<a aria-label='Facebook Profile" ' href={userState.facebook} target="_blank"><FaFacebook className="hover:text-gray-700 dark:hover:text-black transition"/></a>:null}
            {userState?.twitter?<a aria-label='Twitter Profile" ' href={userState?.twitter} target="_blank"><FaXTwitter className="hover:text-gray-700 dark:hover:text-black transition"/></a>:null}
            {userState?.instagram?<a aria-label='Instagram Profile" ' href={userState.instagram} target="_blank"><FaInstagram className="hover:text-gray-700 dark:hover:text-black transition"/></a>:null}
          </div>
        </div>
        <div className={`phone:h-fit laptop:h-full border bg-white border-gray-600 dark:bg-darkTheme w-full laptop:w-3/4 laptop:max-w-[850px] laptop:mx-auto`}>
        <div className={`laptop:h-[90%] laptop:pb-0 phone:h-full phone:pb-44`}>
          <NavDashboard />
          <div className={`p-4 text-black h-full w-full phone:overflow-hidden laptop:overflow-auto scrollbar-thin scrollbar-thumb-rounded-[10px] scrollbar-thumb-violet-950 dark:scrollbar-thumb-white dark:text-white scrollbar-track-slate-300/40 flex flex-wrap gap-2 justify-center`}>
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
              className={`size-[400px] p-4 rounded-lg shadow-cornerStampLight bg-lightOrange dark:bg-darkTheme dark:shadow-cornerStampDark dark:text-white `}
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

import React,{ useState, useEffect, useRef, useMemo } from "react";
import useFetch from "../hook/useFetch";
import { Link, useParams } from "react-router-dom";
import { FaRegNewspaper } from "react-icons/fa";
import DOMPurify from "dompurify";
import LoadingComp from "../component/loadingComp";
import PageNotFound from "../component/404Page";
import { motion, useScroll } from "framer-motion";
import { FaFacebook, FaInstagram} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";
import { MdArrowOutward } from "react-icons/md";
function NewsPage() {
  const { news_id } = useParams();
  const [error, setIsError] = useState<boolean | string | null>(null);
  const [idNotFound, setIdNotFound] = useState<boolean>(false);
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const { scrollYProgress } = useScroll();
  const urlArticleRef = useRef<HTMLElement | null>(null);
  const { value: news, isLoading: isLoading } = useFetch<NewsKey>(
    `/news/get-news/${news_id}`,
    (data) => data.news as NewsKey,
    "GET"
  );
  const { value: user, isLoading: userIsLoading } = useFetch<Userkey>(
    `/user/get-user-info/${news?.createdBy}/1`,
    (data) => data.user as Userkey,
    "GET"
  );
  // useEffect ngubah link dalem artikel jadi proper link
  useEffect(() => {
    if (urlArticleRef.current) {
      const links = urlArticleRef.current.querySelectorAll("A");
      links.forEach((link) => {
        const href = link.getAttribute("href");
        if (
          href &&
          !href.startsWith("http://") &&
          !href.startsWith("https://")
        ) {
          link.setAttribute("href", `https://${href}`);
        }
      });
    }
  }, [news]);
  const sanitizeContent =useMemo(()=>DOMPurify.sanitize(news?.content || "", {
    ALLOWED_TAGS: ["a", "ol", "li", "ul", "p", "b", "i", "strong", "em", "br"],
    ALLOWED_ATTR: ["href", "target", "rel", "data-list"],
  }),[news?.content]);
  const PageNotFoundMemo = React.memo(PageNotFound);
  if (idNotFound) {
    return <PageNotFoundMemo />;
  }
  if (isLoading) {
    return <LoadingComp error={error} />;
  }
  return (
    <>
      <motion.div
        id="scroll-indicator"
        style={{ scaleX: scrollYProgress || 0, originX: 0 }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 to-pink-700 dark:from-blue-400 dark:to-blue-700"
      ></motion.div>
      <div className={`tablet:w-[60%] w-3/4 h-full mx-auto text-center mt-4 py-4`}>
        <h1 className="text-5xl font-Garramond mb-3 uppercase">
          {news?.name_news}
        </h1>
        <div className="flex justify-between text-sm text-black/70 dark:text-gray-400">
          <Link to={`/user/${news?.createdBy}`} className="">Posted By : <span className="text-blue-600 hover:underline">{news?.createdBy}</span></Link>
          <p>
            {" "}
            {news?.updatedAt &&
            new Date(news.updatedAt).getTime() < new Date().getTime()
              ? `${Math.floor(
                  (new Date().getTime() - new Date(news.updatedAt).getTime()) /
                    (1000 * 60 * 60 * 24)
                )?`${Math.floor(
                  (new Date().getTime() - new Date(news.updatedAt).getTime()) /
                    (1000 * 60 * 60 * 24)
                )} Days Ago`:'Today'}`
              : ""}
          </p>
        </div>
        {news?.cover ? (
          <img
            src={`${baseURL}${news.cover}`}
            className="mx-auto w-full tablet:h-96 h-80 border border-gray-600/40 object-[100%_50%]"
          ></img>
        ) : (
          <div
            className={`bg-black flex-col text-white w-3/4 h-96 mx-auto rounded-lg my-4 flex justify-center items-center text-7xl min-h-12`}
          >
            <FaRegNewspaper />
          </div>
        )}
        <p className="italic tablet:w-1/2 w-3/4 mx-auto text-center my-3">
          {news?.description}
        </p>
        <article
          ref={urlArticleRef}
          dangerouslySetInnerHTML={{ __html: sanitizeContent }}
          className="text-justify text leading-8 font-Poppins list-decimal"
        />
        <div className="w-full h-fit border-y border-y-gray-600 my-4 p-4 font-Poppins">
        <div className="flex gap-3 items-center justify-between flex-wrap">
        <div className="flex items-center gap-3">
          {user?.image?<img src={`${baseURL}${user?.image}`} className="size-16 rounded-full object-cover"/>:<div className="size-16 bg-black rounded-full flex justify-center items-center"><IoPerson/></div>}
          <p className="text-left">Posted By: <span className="font-bold hover:underline"><Link to={`/user/${user?.nama_user}`}>{user?.nama_user}</Link></span> {user?.description?user?.description:'Check out other news from this user'}</p>
          </div>
        </div>
          <div className="flex gap-2 w-fit">
                            {user?.facebook ? (
                              <a href={user.facebook} target="_blank">
                                <FaFacebook className="hover:text-gray-700 dark:hover:text-black transition" />
                              </a>
                            ) : null}
                            {user?.twitter ? (
                              <a href={user?.twitter} target="_blank">
                                <FaXTwitter className="hover:text-gray-700 dark:hover:text-black transition" />
                              </a>
                            ) : null}
                            {user?.instagram ? (
                              <a href={user.instagram} target="_blank">
                                <FaInstagram className="hover:text-gray-700 dark:hover:text-black transition" />
                              </a>
                            ) : null}
                          </div>
                          <Link to={`/user/${user?.nama_user}`} className="flex items-center gap-2 w-fit underline mt-2">Check other news from this author<MdArrowOutward/></Link> 
        </div>
      </div>
    </>
  );
}
export default NewsPage;

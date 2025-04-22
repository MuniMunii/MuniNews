import { useEffect, useState,useRef } from "react";
import { useParams } from "react-router-dom";
import LoadingComp from "../../component/loadingComp";
import { FaRegNewspaper } from "react-icons/fa";
import DOMPurify from "dompurify";
import { motion, AnimatePresence } from "framer-motion";
import PageNotFound from "../../component/404Page";
import useFetch from "../../hook/useFetch";
function ReviewNews() {
  type newsStatus = "Published" | "Error" | "Cancelled";
  const { news_id } = useParams();
  // const [news, setNews] = useState<NewsKey>();
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  const [popUp, setPopUp] = useState<boolean>(false);
  const [status, setStatus] = useState<newsStatus | null>(null);
  const [isError, setIsError] = useState<boolean | string | null>(null);
  const [idNotFound,setIdNotFound]=useState<boolean>(false)
  const [modalCancel, setModalCancel] = useState<boolean>(false);
  const [cancelMessages, setCancelMessages] = useState<string>();
  const urlArticleRef=useRef<HTMLElement|null>(null)
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const { value: news, isLoading: isLoading } = useFetch<NewsKey|null>(
    `/news/get-news/${news_id}`,
    (data) => data.news as NewsKey|null,
    "GET"
  );
  useEffect(() => {
    let timer: NodeJS.Timeout;
    timer = setTimeout(() => {
      setPopUp(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [popUp]);
  useEffect(() => {
    console.log(cancelMessages);
  }, [cancelMessages]);
  useEffect(()=>{
    if(urlArticleRef.current){
      const links=urlArticleRef.current.querySelectorAll('A')
      links.forEach((link)=>{const href=link.getAttribute("href")
        if (href && !href.startsWith("http://") && !href.startsWith("https://")) {
          link.setAttribute("href", `https://${href}`);
        }
      })
    }
  },[news])
  const sanitizeContent = DOMPurify.sanitize(news?.content || "", {
    ALLOWED_TAGS: ["a", "ol", "li", "ul", "p", "b", "i", "strong", "em", "br"],
    ALLOWED_ATTR: ["href", "target", "rel","data-list"],
  });
  const handlePublish = async () => {
    try {
      const response = await fetch(`${baseURL}/news/publish-news/${news_id}`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "post",
      });
      const data = await response.json();
      if (response.ok) {
        setPopUp(true);
        setStatus("Published");
      } else {
        setPopUp(true);
        setStatus("Error");
      }
      // Debugging
      console.log(data.messages);
    } catch (error) {
      console.log("error");
    }
  };
  const handleCancel = async () => {
    try {
      const response = await fetch(`${baseURL}/news/cancel-news/${news_id}`, {
        credentials: "include",
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: cancelMessages }),
      });
      const data = await response.json();
      if (response.ok) {
        setPopUp(true);
        setStatus("Cancelled");
      } else {
        setPopUp(true);
        setStatus("Error");
      }
      // Debugging
      console.log(data.messages);
    } catch (error) {
      console.log("error");
    }
  };
  if(idNotFound){return <PageNotFound/>}
  if (isLoading) {
    return <LoadingComp error={null} />;
  }
  return (
    <>
      <AnimatePresence initial={false}>
        {popUp ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`px-7 py-2 fixed bottom-2 right-2 bg-darkTheme border border-gray-600 rounded-lg ${
              status === "Error" || status === "Cancelled"
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {status}
          </motion.div>
        ) : null}
        {modalCancel ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 flex justify-center items-center w-full h-full"
          >
            <div className="bg-lightOrange shadow-cornerStampLight dark:bg-darkTheme dark:shadow-cornerStampDark w-1/2 max-w-56 h-36 rounded-md p-2">
              <label htmlFor="reason" className="text-center">
                Reason
              </label>
              <textarea
                onChange={(e) => setCancelMessages(e.currentTarget.value)}
                className="resize-none text-black"
                id="reason"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    setModalCancel(false);
                    handleCancel();
                  }}
                  className="border border-red-600 hover:bg-red-600 transition rounded-md px-3 py-1"
                >
                  Reject
                </button>
                <button
                  onClick={() => setModalCancel(false)}
                  className="border border-gray-600 rounded-md px-3 py-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className={`tablet:w-[60%] w-3/4 h-full mx-auto text-center`}>
        <h1 className="text-5xl font-Garramond mb-3">{news?.name_news}</h1>
        {news?.cover ? (
          <img
            src={`${baseURL}${news.cover}`}
            className="mx-auto w-full tablet:h-96 h-80 border border-gray-600/40"
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
        <div className="flex gap-2">
          <button
            onClick={handlePublish}
            className="border border-green-600 hover:bg-green-600 transition rounded-md px-3 py-1"
          >
            Publish
          </button>
          <button
            onClick={() => setModalCancel(true)}
            className="border border-red-600 hover:bg-red-600 transition rounded-md px-3 py-1"
          >
            Reject
          </button>
        </div>
      </div>
    </>
  );
}
export default ReviewNews;

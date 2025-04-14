import { useState, useEffect } from "react";
import { IoPerson } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaRegNewspaper } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { HashLink } from "react-router-hash-link";
import useFetch from "../hook/useFetch";
function UserInfo() {
  const [news, setNews] = useState<NewsKey[] | undefined>([]);
  const [page, setPage] = useState<number>(1);
  const [userInfo,setUserInfo]=useState<Userkey>()
  const [isLoading,setIsLoading]=useState<boolean>(true)
  const [stopLoading, setStopLoading] = useState<boolean>(false);
  const { nama_user } = useParams();
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const isNewsLengthMoreThanOne =
    news instanceof Array ? news?.length >= 1 : false;
  const isNewsArray = news instanceof Array;
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `${baseURL}/user/get-user-info/${nama_user}/${page}`,
          { method: "get", credentials: "include" }
        );
        const data = await response.json();
        if (response.ok) {
          setUserInfo(data.user);
          setNews((prev) => [...(prev || []), ...data.news]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
        setStopLoading(true);
      }
    };
    fetchUserInfo();
  }, [nama_user, page]);
  return (
    <div className="w-[90%] h-full mx-auto  my-2 flex">
      <div className="tablet:w-2/3 phone:w-full h-full  flex flex-col">
        <div className="w-full h-fit border-b border-b-gray-600 flex laptop:flex-row phone:flex-col justify-start gap-3 p-3">
          {isLoading ? (
            // Skeleton Effect
            <div className="w-fit">
              <div className="size-48 rounded-full my-auto bg-gray-600 animate-pulse"></div>
            </div>
          ) : userInfo?.image ? (
            <img
              src={`${baseURL}${userInfo?.image}`}
              className="size-48 rounded-full my-auto object-cover"
            ></img>
          ) : (
            <div className="w-fit">
              <div className="size-48 my-auto rounded-full bg-black flex justify-center items-center">
                <IoPerson />
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2 w-full p-3">
            {/* Skeleton effect */}
            {isLoading ? (
              <>
                <div className="w-full flex flex-col gap-2">
                  <div className="w-52 h-9 bg-gray-600 animate-pulse rounded-full"></div>
                  <p className="w-full h-5 bg-gray-600 rounded-full animate-pulse"></p>
                  <p className="w-full h-5 bg-gray-600 rounded-full animate-pulse"></p>
                  <p className="w-full h-5 bg-gray-600 rounded-full animate-pulse"></p>
                  <div className="flex gap-2">
                    <div className="size-5 rounded-full bg-gray-600 animate-pulse"></div>
                    <div className="size-5 rounded-full bg-gray-600 animate-pulse"></div>
                    <div className="size-5 rounded-full bg-gray-600 animate-pulse"></div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-5xl font-Garramond font-light">
                  {userInfo?.nama_user}
                </h1>
                <p className="text-sm uppercase text-gray-800 dark:text-gray-500 font-bold">
                  {userInfo?.role}
                </p>
                <p className="italic">
                  {userInfo?.description
                    ? userInfo.description
                    : "This user hasn't created description yet."}
                </p>
                <div className="flex gap-2">
                  {userInfo?.facebook ? (
                    <a href={userInfo.facebook} target="_blank">
                      <FaFacebook className="hover:text-gray-700 dark:hover:text-black transition" />
                    </a>
                  ) : null}
                  {userInfo?.twitter ? (
                    <a href={userInfo?.twitter} target="_blank">
                      <FaXTwitter className="hover:text-gray-700 dark:hover:text-black transition" />
                    </a>
                  ) : null}
                  {userInfo?.instagram ? (
                    <a href={userInfo.instagram} target="_blank">
                      <FaInstagram className="hover:text-gray-700 dark:hover:text-black transition" />
                    </a>
                  ) : null}
                </div>
              </>
            )}
          </div>
        </div>
        <div
          className={`flex-col w-full h-full flex justify-start ${
            news?.length === 0 ? "items-center" : " items-start"
          }`}
        >
          {isLoading && !stopLoading ? (
            //   Skeleton Loading
            <>
              <div className="flex w-full border-b border-b-gray-600 p-3 gap-2">
                <div className="w-32 h-24 bg-gray-600 rounded-mg animate-pulse"></div>
                <div className="w-full flex flex-col gap-1">
                  <div className="w-64 h-6 bg-gray-600 rounded-full animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-600 rounded-full animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-600 rounded-full animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-600 rounded-full animate-pulse"></div>
                  <div className="w-16 h-4 bg-gray-600 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="flex w-full border-b border-b-gray-600 p-3 gap-2">
                <div className="w-32 h-24 bg-gray-600 rounded-mg animate-pulse"></div>
                <div className="w-full flex flex-col gap-1">
                  <div className="w-64 h-6 bg-gray-600 rounded-full animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-600 rounded-full animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-600 rounded-full animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-600 rounded-full animate-pulse"></div>
                  <div className="w-16 h-4 bg-gray-600 rounded-full animate-pulse"></div>
                </div>
              </div>
            </>
          ) : (
            <div>
              {!isNewsLengthMoreThanOne ? (
                <div className="w-full flex flex-col justify-center items-center h-full mt-5 gap-4">
                  <p>This user hasnt created news yet.</p>
                  <HashLink
                    to={"/newslist#newstitle"}
                    smooth
                    className="py-2 px-4 rounded-md transition-all duration-300 shadow-none bg-lightOrange shadow-cornerStampLight dark:bg-oceanBlue hover:dark:shadow-cornerStampDark"
                  >
                    Check Other News
                  </HashLink>
                </div>
              ) : (
                <>
                  {news?.map((news, index) => {
                    const TimeFormat =
                      news?.updatedAt &&
                      new Date(news.updatedAt).getTime() <
                        new Date().getTime() - 24 * 60 * 60 * 1000;
                    const Time = TimeFormat
                      ? `${Math.floor(
                          (new Date().getTime() -
                            new Date(news.updatedAt).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )} Days Ago`
                      : "Today";
                    return (
                      <Link
                        to={`/read/${news.news_id}`}
                        key={`${news.name_news}-${news.news_id}`}
                        className="border-b border-b-gray-600 flex justify-between gap-2 p-3 group"
                      >
                        {news.cover ? (
                          <img
                            src={`${baseURL}${news.cover}`}
                            className="w-32 h-24 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-32 h-24 bg-black flex justify-center items-center rounded-md">
                            <FaRegNewspaper />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <p className="group-hover:underline">
                            {news.name_news}
                          </p>
                          <p className="text-gray-900 dark:text-gray-400">
                            {news.description}
                          </p>
                          <p className="text-sm text-gray-800 dark:text-gray-500">
                            {Time}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>
        {/* note */}
        {isLoading ? (
          <div className="w-20 h-8 rounded-md bg-gray-600 animate-pulse my-2 mx-auto"></div>
        ) : null}
        {isNewsLengthMoreThanOne ? (
          isNewsArray && news.length > 0 && news.length % 5 === 0 ? (
            <button
              type="button"
              className="bg-lightOrange dark:bg-oceanBlue w-fit py-1 px-3 mx-auto my-2 rounded-md"
              onClick={() => setPage((prev) => prev + 1)}
            >
              Add News
            </button>
          ) : (
            <button
              type="button"
              className="border border-lightOrange dark:border-blue-700 w-fit py-1 px-3 cursor-not-allowed my-2 rounded-md mx-auto"
            >
              No More News
            </button>
          )
        ) : null}
      </div>
    </div>
  );
}
export default UserInfo;

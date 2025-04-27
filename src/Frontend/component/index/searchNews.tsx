import { useState, useEffect, useRef } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import useDebounce from "../../hook/useDebounce";
import { FaRegCompass } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
function SearchNews() {
  const [searchNews, setSearchNews] = useState<string>("");
  const [news, setNews] = useState<NewsKey[] | undefined>();
  const [user, setUser] = useState<Userkey[] | undefined>();
  const [searchDropdown, setSearchDropdown] = useState<boolean>(false);
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const fetchSearchNews = async () => {
    try {
      const response = await fetch(`${baseURL}/news/search-news`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: searchNews }),
      });
      const data = await response.json();
      if (response.ok) {
        setNews(data.news);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchSearchUser = async () => {
    try {
      const response = await fetch(`${baseURL}/user/search-user`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: searchNews }),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const {debounceEffect:debounceSearchNews,cancelDebounce:cancelDebounceNews} = useDebounce(fetchSearchNews, 1000);
  const {debounceEffect:debounceSearchUser,cancelDebounce:cancelDebounceUser} = useDebounce(fetchSearchUser, 1000);
  useEffect(() => {
    debounceSearchNews();
    debounceSearchUser();
    return ()=>{
      cancelDebounceNews()
      cancelDebounceUser()
    }
  }, [searchNews]);
  useEffect(() => {
    const handleCLickOutside = (e: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target as Node) &&
        // note: element yang ga ada class search-dropdown
        !(e.target as Element)?.closest(".search-dropdown")
      ) {
        setSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleCLickOutside);
    return () => document.removeEventListener("mousedown", handleCLickOutside);
  }, []);
  //   const filteredNews = news?.filter((newsItem) =>
  //     newsItem.name_news.toLowerCase().includes(searchNews.toLowerCase())
  //   );
  return (
    <>
      <div className="flex flex-col relative">
        <div
          className={`w-fit border h-8 border-gray-600 rounded-xl flex justify-between items-center pl-2 overflow-hidden`}
        >
          <div className="w-fit p-2 border-r border-r-gray-600">
            <FaMagnifyingGlass />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            aria-controls="search-result"
            aria-expanded={searchDropdown}
            role="combobox"
            aria-autocomplete="list"
            placeholder="Search News"
            className="bg-transparent outline-none w-full h-full pl-2 bg-slate-100 dark:bg-transparent"
            onFocus={() => setSearchDropdown(true)}
            onInput={(e) => setSearchNews(e.currentTarget.value.trim())}
          />
        </div>
        {searchDropdown && (news?.length || user?.length) && (
          <div className="absolute top-full left-0 w-full mt-1 bg-white shadow-md flex flex-col z-20 border rounded-xl overflow-hidden text-black">
            {(() => {
              const filteredNews = news?.filter(
                (newsItem) =>
                  newsItem.name_news
                    .toLowerCase()
                    .includes(searchNews.toLowerCase()) &&
                  newsItem.name_news !== searchNews
              );
              return (filteredNews || []).length > 0 && searchNews !== "" ? (
                (filteredNews || []).slice(0, 5).map((newsItem) => (
                  <Link
                    to={`/read/${newsItem.news_id}`}
                    key={newsItem.news_id}
                    className="p-2 h-fit search-dropdown hover:bg-gray-200 cursor-pointer border-b border-b-gray-600 last:border-b-transparent"
                    role="option"
                    onMouseDown={() =>
                      setTimeout(() => setSearchDropdown(false), 100)
                    }
                    onClick={() => {
                      setSearchNews(newsItem.name_news);
                      setSearchDropdown(false);
                    }}
                  >
                    <p>{newsItem.name_news}</p>
                    <p className="text-gray-600 text-sm uppercase">
                      {newsItem.category}
                    </p>
                  </Link>
                ))
              ) : (
                <HashLink
                  smooth
                  to={"/newslist#newstitle"}
                  onClick={() => setSearchDropdown(false)}
                  className="w-full p-4 flex search-dropdown justify-between items-center group cursor-pointer"
                >
                  <p className="flex gap-2 items-center">
                    <FaRegCompass /> Explore News
                  </p>
                  <MdArrowOutward className="text-black/60 group-hover:text-black/100 transition-colors" />
                </HashLink>
              );
            })()}
            {searchNews?.trim() &&
            (user || []).filter(
              (user) =>
                user.nama_user
                  .toLocaleLowerCase()
                  .includes(searchNews.toLocaleLowerCase()) &&
                user.nama_user !== searchNews
            ).length > 0 ? (
              <p className="font-semibold border-b border-b-gray-600 text-center">
                User
              </p>
            ) : null}
            {(() => {
              const filteredUser = user?.filter(
                (user) =>
                  user.nama_user
                    .toLowerCase()
                    .includes(searchNews.toLowerCase()) &&
                  user.nama_user !== searchNews
              );
              return (
                (filteredUser || []).length > 0 &&
                searchNews !== "" &&
                filteredUser?.slice(0, 5).map((user) => {
                  return (
                    <Link
                      to={`/user/${user.nama_user}`}
                      key={user.id}
                      className="p-2 h-fit search-dropdown hover:bg-gray-200 cursor-pointer border-b border-b-gray-600 last:border-b-transparent"
                      role="option"
                      onMouseDown={() =>
                        setTimeout(() => setSearchDropdown(false), 100)
                      }
                      onClick={() => {
                        setSearchNews(user.nama_user);
                        setSearchDropdown(false);
                      }}
                    >
                      <p>{user.nama_user}</p>
                    </Link>
                  );
                })
              );
            })()}
          </div>
        )}
      </div>
    </>
  );
}
export default SearchNews;

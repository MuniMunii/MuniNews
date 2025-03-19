import { useState,useEffect } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import useDebounce from "../../hook/useDebounce";
function SearchNews(){
    const [searchNews,setSearchNews]=useState<string>('')
    const [news,setNews]=useState<NewsKey[]|undefined>()
    const baseURL=process.env.REACT_APP_BACKEND_URL
    const fetchSearchNews=async()=>{
        try{
            const response=await fetch(`${baseURL}/news/search-news`,{method:'post',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:searchNews})})
            const data=await response.json()
            if(response.ok){
                setNews(data.news)
            }
        }catch(error){console.log(error)}
    }
    const debounceSearchNews=useDebounce(fetchSearchNews,2000)
      useEffect(()=>{debounceSearchNews()},[searchNews])
      useEffect(()=>{console.log(news)},[news])
    return (
        <div className="w-fit border border-gray-600 rounded-full flex justify-between items-center">
        <div className="w-fit p-1">
        <FaMagnifyingGlass/>
        </div>
        <input type="text" placeholder="Search News" className="bg-transparent outline-none" onInput={(e)=>setSearchNews(e.currentTarget.value.trim())}/>
      </div>
    )
}
export default SearchNews
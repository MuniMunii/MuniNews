import { useTheme,useUser,useScreen } from "../../context/context";
import useFetch from "../../hook/useFetch";
import { useEffect, useState,memo } from "react";
import { HiOutlineTemplate,HiOutlinePencilAlt,HiOutlineClipboardList,HiOutlineClipboardCheck,HiOutlineClipboardCopy } from "react-icons/hi";
import '../../style/animation.css'
import LoadingComp from "../../component/loadingComp";
import NewsRecentList from "../../component/admin/NewsRecentList";
import UserList from "../../component/admin/UserList";
import { Link } from "react-router-dom";
const DashboardAdmin=memo(()=>{
    const {user}=useUser()
    const {isWideScreen}=useScreen()
    const [newsDataState,setNewsDataState]=useState<NewsKey[]>([]);
    const [isLoading,setIsLoading]=useState<boolean>(true)
    const baseURL=process.env.REACT_APP_BACKEND_URL;
    useEffect(()=>{
        const fetchNews=async()=>{
            try{
            const response=await fetch(`${baseURL}/news/get-news`,{method:'get',credentials:'include',headers:{'Content-Type':'application/json'}})
            const data=await response.json()
            setNewsDataState(data.news)
            }
            catch(error){console.log(error)}finally{setIsLoading(false)}
        }
        fetchNews()
        console.log('rerender')
    },[])
    console.log('component re render')
    useEffect(()=>{console.log(newsDataState)},[newsDataState])
    if(!isWideScreen){
        return <div className=" flex justify-center items-center h-full font-mono">
            <div className={`w-3/5 h-52 flex flex-col text-center justify-center items-center bg-slate-600/40 text-black dark:text-white rounded-lg`}>
            <p>pls access this with Tablet or larger devices</p>
            <p>{`( >_< '')`}</p>
                </div></div>
    }
    return (
        <>
        <div className="diagonal-pattern w-full h-full min-h-screen flex gap-7 font-Poppins">
            <div className={`w-96 h-full border-r  p-4 flex flex-col items-center justify-between font-Poppins bg-white border-gray-600 dark:bg-darkTheme text-black`}>
                <div className="flex flex-col gap-2 w-3/4">
                <a className={`py-1 px-3 font-semibold text-black/50 hover:text-black dark:text-white/40 dark:hover:text-white transition duration-300 select-none cursor-pointer rounded-md flex items-center gap-2`}><HiOutlineTemplate/>Dashboard </a>
                <a className={`py-1 px-3 font-semibold text-black/50 hover:text-black dark:text-white/40 dark:hover:text-white transition duration-300 select-none cursor-pointer rounded-md flex items-center gap-2`}><HiOutlinePencilAlt/>News</a>
                </div>
                <div className={`border-t border-t-gray-600 w-full text-center py-3 dark:text-white text-sm`}>
                    <a>Admin: {user}</a>
                </div>
            </div>
            <div className={`w-full h-full p-5 flex flex-col rounded-bl-3xl rounded-tl-3xl border border-gray-600 bg-white dark:bg-darkTheme`}>
                <div className="w-full h-fit flex gap-3 justify-center mb-3">
                    <div className={`w-1/3 h-32 rounded-lg p-4 text-center flex flex-col items-center justify-center text-xl border bg-gradient-to-t dark:shadow-none dark:text-white text-green-700 shadow-cornerStampGreen dark:from-violet-950 dark:to-darkTheme `}>
                    <p>Published News<HiOutlineClipboardCheck className={`text-black dark:text-white mx-auto text-3xl`}/></p>
                    <p>{newsDataState.filter(news=>news.verified).length}</p>
                    </div>
                    <div className={`w-1/3 h-32 rounded-lg p-4 text-center flex flex-col items-center justify-center text-xl border bg-gradient-to-t dark:shadow-none dark:text-white text-blue-700 shadow-cornerStampBlue dark:from-amber-950 dark:to-darkTheme `}>
                    <p>Total News<HiOutlineClipboardList className={`text-black dark:text-white mx-auto text-3xl`}/></p>
                    <p>{newsDataState.filter(news=>news.news_id).length}</p></div>
                    <div className={`w-1/3 h-32 rounded-lg p-4 text-center flex flex-col items-center justify-center text-xl border bg-gradient-to-t dark:shadow-none dark:text-white text-red-700 shadow-cornerStampRed dark:from-pink-950 dark:to-darkTheme`}>
                    <p>News In Review<HiOutlineClipboardCopy className={`text-black dark:text-white mx-auto text-3xl`}/></p>
                    {/* nanti di ganti jadi inreview */}
                    <p>{newsDataState.filter(news=>news.status==='archived').length}</p></div>
                </div>
                <div className={`w-full h-full flex gap-2`}>
                    <div className={`w-9/12 h-full border border-gray-600 dark:bg-[#0f1936] rounded-lg flex flex-col p-4 gap-4`}>
                    <div className={`w-full h-12 rounded-md border border-gray-600 dark:bg-[#121e41]  dark:text-white  font-semibold py-2 px-4 flex items-center`}>Recent News</div>
                    <div className={`w-full h-full border border-gray-600 dark:bg-[#121e41] rounded-md flex flex-col p-3 overflow-auto scrollbar-none gap-4`}>
                        {isLoading?<LoadingComp error={null}/>:<NewsRecentList news={newsDataState}/>}
                    </div>
                    </div>
                    <div className={`w-1/4 h-full bg-gradient-to-t border border-gray-600 dark:from-indigo-950 dark:to-darkTheme  rounded-lg flex flex-col p-2 gap-3`}>
                    <div className={`w-full h-fit rounded-md border border-gray-600 dark:bg-[#121e41] p-2 flex items-center`}>Journalist List</div>
                    <UserList/>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
})
export default DashboardAdmin;
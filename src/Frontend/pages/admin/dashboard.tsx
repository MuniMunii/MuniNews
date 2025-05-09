import { useScreen } from "../../context/context";
import useFetch from "../../hook/useFetch";
import { useEffect, memo } from "react";
import {HiOutlineClipboardList,HiOutlineClipboardCheck,HiOutlineClipboardCopy } from "react-icons/hi";
import '../../style/animation.css'
import LoadingComp from "../../component/loadingComp";
import NewsRecentList from "../../component/admin/NewsRecentList";
import UserList from "../../component/admin/UserList";
import NavbarAdmin from "../../component/admin/navbar";
import { Helmet } from "react-helmet";
const DashboardAdmin=memo(()=>{
    const {isWideScreen}=useScreen()
    const { value: newsDataState, isLoading: isLoading } = useFetch<NewsKey[]|null>(
        `/news/get-news`,
        (data) => data.news as NewsKey[]|null,
        "GET",
      );
    // useEffect(()=>{console.log(newsDataState)},[newsDataState])
    if(!isWideScreen){
        return <div className=" flex justify-center items-center h-full font-mono">
            <div className={`w-3/5 h-52 flex flex-col text-center justify-center items-center bg-slate-600/40 text-black dark:text-white rounded-lg`}>
            <p>pls access this with Tablet or larger devices</p>
            <p>{`( >_< '')`}</p>
                </div></div>
    }
    return (
        <>
        <Helmet>
    <title>Dashboard</title>
</Helmet>
        <div className="diagonal-pattern w-full h-full min-h-screen flex gap-7 font-Poppins">
            <NavbarAdmin/>
            <div className={`w-full h-full p-5 flex flex-col rounded-bl-3xl rounded-tl-3xl border border-gray-600 bg-white dark:bg-darkTheme`}>
                <div className="w-full h-fit flex gap-3 justify-center mb-3">
                    <div className={`w-1/3 h-32 rounded-lg p-4 text-center flex flex-col items-center justify-center text-xl border bg-gradient-to-t dark:shadow-none dark:text-white text-green-700 shadow-cornerStampGreen dark:from-violet-950 dark:to-darkTheme `}>
                    <p>Published News<HiOutlineClipboardCheck className={`text-black dark:text-white mx-auto text-3xl`}/></p>
                    <p>{newsDataState?.filter(news=>news.verified).length}</p>
                    </div>
                    <div className={`w-1/3 h-32 rounded-lg p-4 text-center flex flex-col items-center justify-center text-xl border bg-gradient-to-t dark:shadow-none dark:text-white text-blue-700 shadow-cornerStampBlue dark:from-amber-950 dark:to-darkTheme `}>
                    <p>Total News<HiOutlineClipboardList className={`text-black dark:text-white mx-auto text-3xl`}/></p>
                    <p>{newsDataState?.filter(news=>news.status==='inreview'||news.status==="published").length}</p></div>
                    <div className={`w-1/3 h-32 rounded-lg p-4 text-center flex flex-col items-center justify-center text-xl border bg-gradient-to-t dark:shadow-none dark:text-white text-red-700 shadow-cornerStampRed dark:from-pink-950 dark:to-darkTheme`}>
                    <p>News In Review<HiOutlineClipboardCopy className={`text-black dark:text-white mx-auto text-3xl`}/></p>
                    {/* nanti di ganti jadi inreview */}
                    <p>{newsDataState?.filter(news=>news.status==='inreview').length}</p></div>
                </div>
                <div className={`w-full h-full max-h-[1000px] flex gap-2`}>
                    <div className={`w-9/12 h-full border border-gray-600 dark:bg-[#0f1936] rounded-lg flex flex-col p-4 gap-4`}>
                    <div className={`w-full h-12 rounded-md border border-gray-600 dark:bg-[#121e41]  dark:text-white  font-semibold py-2 px-4 flex items-center`}>Recent News</div>
                    <div className={`w-full h-full border border-gray-600 dark:bg-[#121e41] rounded-md flex flex-col p-3 overflow-auto scrollbar-none gap-4`}>
                        {isLoading?<LoadingComp error={null}/>:<NewsRecentList news={newsDataState}/>}
                    </div>
                    </div>
                    <div className={`w-1/4 h-full max-h-[1000px] bg-gradient-to-t border border-gray-600 dark:from-indigo-950 dark:to-darkTheme  rounded-lg flex flex-col p-2 gap-3`}>
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
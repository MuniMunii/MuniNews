import { useEffect, useState } from "react";
import { useTheme } from "../../context/context";
import useFetch from "../../hook/useFetch";
function DashboardUser() {
    const [isActive,setIsActive]=useState<string>('about')
    useEffect(()=>{console.log(isActive)},[isActive])
  const { user, role,theme } = useTheme();
  const isLight=theme==='light'
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const { value: userInfo, isLoading: isLoadingUserInfo } = useFetch(
    `${baseURL}/auth/me`,
    (data) => ({
      //   news: data.news as NewsItem[],
      me: data,
    })
  );
  console.log(userInfo?.me);
  return (
    <div className="bg-black/30 mx-auto w-[90%] max-w-[800px] h-full flex flex-col laptop:flex-row-reverse laptop:w-full laptop:max-w-full">
            <div className={`laptop:block laptop:w-1/3 flex bg-white items-center gap-3 p-4`}>
                <div className="bg-black size-32 rounded-full"></div>
                <p className="text-black">{user}</p>
            </div>
            <div className="bg-slate-600 h-full w-full laptop:w-3/4 laptop:max-w-[750px] laptop:mx-auto ">
            <div className="w-full h-9 flex mt-2 text-white font-mono px-4 justify-between">
                <div className="flex">
                <button className={`px-3 pb-3 transition duration-100 hover:border-b hover:border-b-white ${isActive==='about'?'border-b border-b-white':''}`} onClick={()=>setIsActive('about')}>About</button>
                <button className={`px-3 pb-3 transition duration-100 hover:border-b hover:border-b-white ${isActive==='mynews'?'border-b border-b-white':''}`} onClick={()=>setIsActive('mynews')}>MyNews</button>
                <button className={`px-3 pb-3 transition duration-100 hover:border-b hover:border-b-white ${isActive==='archived'?'border-b border-b-white':''}`} onClick={()=>setIsActive('archived')}>Archived</button>
                <button className={`px-3 pb-3 transition duration-100 hover:border-b hover:border-b-white ${isActive==='cancelled'?'border-b border-b-white':''}`} onClick={()=>setIsActive('cancelled')}>Cancelled</button>
                </div>
                <a className="px-2 py-1 bg-black rounded-md cursor-pointer">Add News +</a>
            </div>
            
            </div>
    </div>
  );
}
export default DashboardUser;

import { useEffect, useState } from "react";
import LoadingComp from "../loadingComp";
import { useTheme } from "../../context/context";
function UserList (){
    const [userList,setUserList]=useState<Userkey[]|null>();
    const [error,setError]=useState<string|boolean|null>(null);
    const [isLoading,setIsLoading]=useState<boolean>(true);
    const {theme}=useTheme()
    const isLight=theme==="light"
    const baseURL=process.env.REACT_APP_BACKEND_URL;
    useEffect(()=>{
        const fetchUser=async()=>{
            try{
                const response=await fetch(`${baseURL}/auth/get-user`,{method:'get',credentials:'include',headers:{'Content-Type':'application/json'}})
                const data=await response.json()
                if(response.ok){
                    setUserList(data.getUser)
                }else{setError(data.messages)}
                
            }catch(error){console.log(error)}finally{setIsLoading(false)}
        }
        fetchUser()
    },[])
    return isLoading?<LoadingComp error={error}/>:userList?.map((user,index)=>(
        <div key={user.id} className={`w-full  h-fit p-2 bg-gradient-to-t border border-gray-600 break-all ${isLight?'':'from-violet-950 to-sky-950'} flex justify-between items-center rounded-md`}>
            <p>{user.nama_user}</p>
            {user.isAuth?<div className="size-2 rounded-full bg-green-600"></div>:<div className="size-2 rounded-full bg-red-600"></div>}
        </div>
    ))
}
export default UserList;
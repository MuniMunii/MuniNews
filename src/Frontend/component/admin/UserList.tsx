import { useState } from "react";
import LoadingComp from "../loadingComp";
import { Link } from "react-router-dom";
import useFetch from "../../hook/useFetch";
function UserList (){
    const [error,setError]=useState<string|boolean|null>(null);
      const { value: userList, isLoading: isLoading } = useFetch<Userkey[]|null>(
        `/auth/get-user`,
        (data) => data.getUser as Userkey[]|null,
        "GET"
      );
    return isLoading?<LoadingComp error={error}/>:userList?.map((user,index)=>(
        <Link to={`/user/${user.nama_user}`} key={user.id} className={`w-full  h-fit p-2 bg-gradient-to-t border border-gray-600 break-all dark:from-violet-950 dark:to-sky-950 flex justify-between items-center rounded-md`}>
            <p>{user.nama_user}</p>
            {user.isAuth?<div className="size-2 rounded-full bg-green-600"></div>:<div className="size-2 rounded-full bg-red-600"></div>}
        </Link>
    ))
}
export default UserList;
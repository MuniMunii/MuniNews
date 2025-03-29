import {useState,useEffect} from "react";
import { IoPerson } from "react-icons/io5";
import {useParams} from "react-router-dom";
function UserInfo(){
    const [userInfo, setUserInfo] = useState<Userkey>();
    const [news,setNews]=useState<NewsKey[]|undefined>();
    const [page,setPage] = useState<number>(1);
    const {nama_user} = useParams()
    const baseURL = process.env.REACT_APP_BACKEND_URL;
    useEffect(()=>{
        const fetchUserInfo = async ()=>{
            try{
                const response=await fetch(`${baseURL}/get-news/${nama_user}/${page}`,{method:'get',credentials:'include'})
                const data=await response.json()
                if(response.ok){
                    setUserInfo(data.user)
                    setNews(data.news)
                }
            }catch(error){console.log(error)}
        }
        fetchUserInfo()
    },[nama_user])
    // note: 1 rapihin ini
    // note: 2 tambahin skeleton loading
    return (
    <div className="w-[90%] h-full mx-auto border border-gray-600 my-2 flex">
        <div className="tablet:w-2/3 phone:w-full h-full border border-gray-600 flex flex-col">
        <div className="w-full h-60 border-b border-b-gray-600 flex justify-center p-3">
            {userInfo?.image?<img src={`${baseURL}${userInfo?.image}`} className="size-48 rounded-full my-auto"></img>:<div className="size-48 my-auto rounded-full bg-black flex justify-center items-center"><IoPerson/></div>}
            <div className="w-">
                <h1 className="text-2xl font-bold">{userInfo?.nama_user}</h1>
                
            </div>
        </div>
        </div>
    </div>)
}
export default UserInfo;
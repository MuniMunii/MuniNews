import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../hook/useFetch";

function EditNews(){
    const {news_id}=useParams()
    const [loading,setIsLoading]=useState<boolean>(true)
    const [newsValue,setNewsValue]=useState<NewsKey|null>()
    const baseURL = process.env.REACT_APP_BACKEND_URL;
    useEffect(()=>{
        const fetchNews=async ()=>{
            try{
                const response=await fetch(`${baseURL}/news/edit-news/${news_id}`,{
                    credentials:'include',
                    method:'Get'
                })
                const data=await response.json()
                setNewsValue(data.news)
                console.log(data)
            }catch(error){
                console.log(error)
            }finally{
                setIsLoading(false)
            }
        }
        fetchNews()
    },[news_id])
    if(loading){return (<p>isLoading Wait</p>)}
    return (<>
    <div>this is editNews {news_id} {newsValue?.name_news}</div>
    </>)
}
export default EditNews;
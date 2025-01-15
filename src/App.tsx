import React,{useState,useEffect} from 'react';
import './App.css';
function App() {
  interface DataParam{
    news:[],
    page:number
  }
  interface URL{
    page_size:number,
    limit:number,
  }
  interface ErrorStatus{
    status:number,
    msg:string
  }
  const [data,setData]=useState<DataParam>()
  const [url,setUrl]=useState<URL>({
    page_size:5,
    limit:10
  })
  const [errorMsg,setErrorMsg]=useState<ErrorStatus|null>(null)
  useEffect(()=>{
    const baseURL='https://api.currentsapi.services/v1/latest-news'
    // api key di env
    const newUrlParameter=new URLSearchParams({
      apiKey,
      page_size:String(url.page_size),
      limit:String(url.limit)
    }).toString()
    const newURL=`${baseURL}?${newUrlParameter}`
    console.log(newURL)
    fetch(newURL)
    .then(response=>{
      if(!response.ok){
        setErrorMsg({status:response.status,msg:response.statusText||"Error Unknown"})
        console.log('error')
      }
      return response.json()})
      .then(dataAPI=>setData({news:dataAPI.news,page:dataAPI.page}))
      .catch(err=>console.log(err))
      
  },[])
  useEffect(()=>{console.log(data)},[data])
  return (
    <div className="App bg-white w-full h-screen text-9xl">
      {errorMsg?.status}
      {errorMsg?.msg}
hihihiiiiiiiiiiiiiii
    </div>
  );
}

export default App;

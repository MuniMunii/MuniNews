import { useEffect, useState,forwardRef, useRef } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../hook/useFetch";
import { FaRegNewspaper } from "react-icons/fa";
import {motion,AnimatePresence} from "framer-motion"
import { useTheme } from "../../context/context";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import '../../style/quillCss.css'
import useDebounce from "../../hook/useDebounce";
function EditNews() {
  const { news_id } = useParams();
  const {theme}=useTheme()
  const [loading, setIsLoading] = useState<boolean>(true);
  const [isError,setIsError]=useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(true);
  const [newsValue, setNewsValue] = useState<NewsKey | null>();
  const [titleValue, setTitleValue] = useState<string>("");
  const [descriptionValue, setDescriptionValue] = useState<string>("");
  const [contentValue, setContentValue] = useState<string>("");
  const [modalDelete,setModalDelete]=useState<boolean>(false)
  const [coverValue,setCoverValue]=useState<string>('')
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const inputTitleRef=useRef<HTMLTextAreaElement>(null)
  const isLight=theme==='light'
//   const QuillEditor = forwardRef<ReactQuill>((props,ref)=>(
//     <ReactQuill ref={ref} {...props}/>
//   ));
  // debug useEffect
  useEffect(() => {
    console.log("titleValue: ", titleValue);
    console.log("descriptionValue: ", descriptionValue);
    console.log("contentValue: ", contentValue);
    console.log("isSaving: ", isSaving)
  }, [titleValue, descriptionValue,contentValue,isSaving]);
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${baseURL}/news/edit-news/${news_id}`, {
          credentials: "include",
          method: "Get",
        });
        const data = await response.json();
        setNewsValue(data.news);
        setTitleValue(data.news.name_news || "");
        setDescriptionValue(data.news.description);
        setCoverValue(data.news.cover)
        setContentValue(data.news.content);
        console.log(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, [news_id]);
  
  const autoSave=async ()=>{
    try{
        const response=await fetch(`${baseURL}/news/edit-news/save-value/${news_id}`,{
            method:'post',
            credentials:'include',
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify({title:titleValue,description:descriptionValue,content:contentValue,cover:coverValue})
        })
        const data=await response.json()
        setIsError(data.messages)
    }catch(error){setIsError(true);console.log('error: ',error)}finally{setIsSaving(false)}
  }
  const debounceAutoSave=useDebounce(autoSave,3000)
    useEffect(()=>{
            debounceAutoSave()
    },[titleValue,descriptionValue,contentValue,coverValue])
  if (loading) {
    return <p>isLoading Wait</p>;
  }
  return (
    <>
    <AnimatePresence initial={false}>
        {modalDelete?
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:1}} className="w-full h-full fixed z-30 flex justify-center items-center">
            <div className="bg-slate-400 w-1/2 max-w-56 h-20">
            <button onClick={()=>setModalDelete(false)}> Close</button>
            </div>
        </motion.div>
        :null}
        {isSaving?<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:1}} className="fixed bottom-3 right-3 w-24 h-10 bg-slate-400 rounded-lg flex justify-center items-center"><p>Saving...</p></motion.div>:null}
    </AnimatePresence>
      <div className="tablet:w-4/5 max-w-full phone:w-3/5 min-w-0 h-full mx-auto">
        <p className="break-words">news {newsValue?.name_news}</p>
        <form action="" method="post" className="mx-auto w-full">
          <label htmlFor="title"></label>
          <textarea
          rows={1}
          ref={inputTitleRef}
            maxLength={50}
            id="title"
            value={titleValue}
            onBlur={autoSave}
            onChange={(e) =>{setTitleValue(e.currentTarget.value);e.currentTarget.style.height='auto';e.currentTarget.style.height=`${e.currentTarget.scrollHeight}px`;setIsSaving(true)}}
            style={{height:inputTitleRef.current?.scrollHeight}}
            className={`w-full outline-none bg-gray-600/40 rounded-lg px-7 py-3 text-5xl resize-none text-center ${isLight?'bg-[#FFE9CE]':'bg-gray-600/40'}`}
          />
          <div className={`bg-black flex-col text-white w-11/12 h-80 mx-auto rounded-lg my-4 flex justify-center items-center text-7xl min-h-12`}>
            <FaRegNewspaper />
            <button className={`${isLight?'bg-oceanBlue':'bg-oceanBlue'} py-1 px-3 rounded-md text-xl`}>Add Cover</button>
          </div>
          <label htmlFor="desc">Description</label>
          <textarea
            maxLength={150}
            id="desc"
            value={descriptionValue}
            onBlur={autoSave}
            onChange={(e) =>{setDescriptionValue(e.currentTarget.value);e.currentTarget.style.height='auto';e.currentTarget.style.height=`${e.currentTarget.scrollHeight}px`;setIsSaving(true)}}
            style={{height:inputTitleRef.current?.scrollHeight}}
            className={`w-full text-center resize-none outline-none bg-gray-600/40 rounded-lg px-7 py-3 italic ${isLight?'bg-[#FFE9CE]':'bg-gray-600/40'}`}
          />
          <label htmlFor="Content">Content</label>
          {contentValue.length===0?<p className="text-center text-red-500">Content Cannot be empty</p>:null}
          <ReactQuill
            value={contentValue}
            onBlur={autoSave}
            onChange={(value)=>{setContentValue(value);setIsSaving(true)}}
            theme="snow"
          />
          <div className="my-3 flex gap-3">
          <button type="submit" className="px-3 py-1 bg-green-500 rounded-md">Publish</button>
          <button type="button" className="px-2 py-1 bg-red-500 rounded-md" onClick={()=>setModalDelete(true)}>Delete</button>
          </div>
        </form>
      </div>
    </>
  );
}
export default EditNews;

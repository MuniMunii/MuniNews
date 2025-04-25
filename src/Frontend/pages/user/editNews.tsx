import { useEffect, useState } from "react";
import {useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../../context/context";
import FormEditNews from "../../component/user/formEditNews";
import { useNavigate } from "react-router-dom";
function EditNews() {
  const navigate=useNavigate()
  const { news_id } = useParams();
  const {user}=useUser()
  const [loading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean | string>(false);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(true);
  const [modalValidation, setModalValidation] = useState<boolean>(false);
  const [validation, setValidation] = useState<boolean | string | null>("");
  const baseURL=process.env.REACT_APP_BACKEND_URL
  useEffect(() => {
    let timer: NodeJS.Timeout;
    timer = setTimeout(() => {
      setModalValidation(false);
      setModalDelete(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [modalValidation,modalDelete]);
    const deleteNews = async (e: any) => {
      e.preventDefault();
      try {
        const response = await fetch(
          `${baseURL}/news/edit-news/delete-news/${news_id}`,
          {
            method: "post",
            credentials: "include",
            headers: { "Content-Type": "application.json" },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setModalValidation(true)
          setValidation(data.messages)
          setTimeout(()=>{navigate(`/${user}/dashboard`)},2000)
        }
      } catch (error) {
        console.log("error try again");
      }
    };
  return (
    <>
      <AnimatePresence initial={false}>
        {modalDelete ? (
          <motion.div
          key={'modalDelete'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full fixed z-30 flex justify-center items-center"
          >
              <div className="bg-lightOrange shadow-cornerStampLight dark:bg-darkTheme dark:shadow-cornerStampDark w-1/2 max-w-56 h-32 rounded-md p-2">
              <button onClick={() => setModalDelete(false)}> X</button>
              <p className="w-full text-center text-red-400">Are you sure wanna delete this news?</p>
              <div className="mt-auto flex gap-2 w-full justify-center">
              <button type="button" className="py-1 px-3 border border-red-600 hover:bg-red-600 rounded-md transition" onClick={deleteNews}>Delete</button>
              <button type="button" className="py-1 px-3 border border-gray-600 rounded-md" onClick={()=>setModalDelete(false)}>Cancel</button>
              </div>
            </div>
          </motion.div>
        ) : null}
        {modalValidation ? (
          <motion.div
          key={'modalvalidation'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full fixed z-30 flex justify-center items-center"
          >
            <div className="bg-lightOrange shadow-cornerStampLight dark:bg-darkTheme dark:shadow-cornerStampDark w-1/2 max-w-56 h-32 flex flex-col items-start rounded-md justify-between p-2">
              <button onClick={() => setModalValidation(false)}> X</button>
              <p className="w-full text-center text-red-400">{validation || "403 forbidden"}</p>
              <p className="text-xs w-full text-center">
                This messages will automaticaly close
              </p>
            </div>
          </motion.div>
        ) : null}
        {isSaving ? (
          <motion.div
          key={'issaving'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            className="fixed bottom-3 right-3 w-24 h-10 bg-slate-400 rounded-lg flex justify-center items-center"
          >
            <p>Saving...</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="w-4/5 max-w-full min-w-0 h-full mx-auto my-3">
        <FormEditNews
          setModalValidation={setModalValidation}
          setValidation={setValidation}
          news_id={news_id}
          setIsError={setIsError}
          setModalDelete={setModalDelete}
          setIsLoading={setIsLoading}
          setIsSaving={setIsSaving}
          isSaving={isSaving}
        />
      </div>
    </>
  );
}
export default EditNews;

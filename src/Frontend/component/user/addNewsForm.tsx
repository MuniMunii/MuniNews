import React, { useState, useEffect, FunctionComponent } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { useTheme, useUser } from "../../context/context";
import { animate, AnimatePresence, motion } from "framer-motion";
function AddNewsForm({
  setModalMakeNews,
  setModalPopUp,
  setError
}: {
  setModalMakeNews: React.Dispatch<React.SetStateAction<boolean>>;
  setModalPopUp: React.Dispatch<React.SetStateAction<boolean>>
  setError: React.Dispatch<React.SetStateAction<any>>
}) {

  const { user, isAuthenticated } = useUser();
  const [title, setTitle] = useState<String>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const baseURL=process.env.REACT_APP_BACKEND_URL
  const navigate=useNavigate()
  useEffect(() => {
    console.log(category);
  }, [category]);
  function handleSelect(value: string) {
    setCategory(value);
  }
  const addNews = async (e: any) => {
    e.preventDefault();
    if (title.length === 0) {
      setModalPopUp(true);
      return setError("title cannot be empty");
    }
    if (description.length === 0) {
      setModalPopUp(true);
      return setError("description cannot be empty");
    }
    if (category === "") {
      setModalPopUp(true);
      return setError("Choose the category");
    }
    try {
      console.log("try fetch add news");
      const response = await fetch(`${baseURL}/news/make-news`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          user: user,
          isAuth: isAuthenticated,
          title: title,
          category: category,
          description: description,
        }),
      });
      const data: NewsStatus = await response.json();
      if (!response.ok) {
        setError(data.messages);
        setModalPopUp(true);
      }
      if (response.ok) {
        setError(data.messages);
        setModalPopUp(true);
        setTimeout(() => navigate(`/${user}/edit-news/${data.news_id}`), 3000);
      }
    } catch (error) {
      setModalPopUp(true);
      setError("Error adding news");
    }
  };
  return (
    <>
      <form
        onSubmit={addNews}
        className="flex flex-col justify-around items-center h-[90%]"
      >
        <div className="flex flex-col w-full justify-center items-center">
          <label htmlFor="title">Title</label>
          <p className="text-left text-sm font-thin">Text Left:{50-title.length}</p>
          <input
            onInput={(e) => setTitle(e.currentTarget.value)}
            autoComplete="off"
            type="text"
            maxLength={50}
            placeholder="Input Title Name"
            id="title"
            className="outline-none w-9/12 px-3 text-black rounded py-1"
          />
          <label htmlFor="description">description</label>
          <p className="text-left text-sm font-thin">Text Left:{150-description.length}</p>
          <textarea
          maxLength={150}
            onInput={(e) => setDescription(e.currentTarget.value)}
            autoComplete="off"
            placeholder="Input Description"
            id="title"
            className="outline-none w-9/12 h-24 px-3 resize-none text-black rounded py-1"
          />
          <label htmlFor="category">Category</label>
          <select
            id="category"
            className="text-black px-3"
            onChange={(e) => handleSelect(e.currentTarget.value)}
          >
            <option value="" disabled selected>
              Select a Category
            </option>
            <option value={"Politics"}>Politics</option>
            <option value={"Sciences"}>Sciences</option>
            <option value={"Sport"}>Sport</option>
            <option value={"Tech"}>Technologies</option>
            <option value={"General"}>General</option>
          </select>
        </div>
        <div className="flex gap-2 flex-wrap font-poppins">
          <button
            type="submit"
            className="mt-auto bg-green-500 px-3 rounded text-black uppercase font-poppins"
          >
            Add News
          </button>
          <button
            type="button"
            onClick={() => setModalMakeNews(false)}
            className={`border border-black/50 dark:border-gray-600 font-Poppins rounded px-2`}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
export default AddNewsForm;

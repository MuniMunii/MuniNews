import React, { useState, useEffect, useRef, SetStateAction } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "../../style/quillCss.css";
import useDebounce from "../../hook/useDebounce";
import { FaRegNewspaper } from "react-icons/fa";
interface FormInterface {
  news_id: string | undefined;
  setModalDelete: React.Dispatch<SetStateAction<boolean>>;
  setIsError: React.Dispatch<SetStateAction<boolean | string>>;
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
  isSaving: boolean;
  setIsSaving: React.Dispatch<SetStateAction<boolean>>;
  setModalValidation: React.Dispatch<SetStateAction<boolean>>;
  setValidation:any;
}
function FormEditNews({
  news_id,
  setModalDelete,
  setIsError,
  setIsLoading,
  isSaving,
  setIsSaving,
  setModalValidation,
  setValidation
}: FormInterface) {
  const [newsValue, setNewsValue] = useState<NewsKey | null>();
  const [originalValue,setOriginalValue]=useState({
    title: "",
  description: "",
  content: ""
  })
  const [titleValue, setTitleValue] = useState<string>("");
  const [descriptionValue, setDescriptionValue] = useState<string>("");
  const [contentValue, setContentValue] = useState<string>("");
  const [coverValue, setCoverValue] = useState<string>("");
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const inputTitleRef = useRef<HTMLTextAreaElement>(null);
  useEffect(()=>{setIsSaving(false)},[isSaving])
  const autoSave = async () => {
    try {
      const response = await fetch(
        `${baseURL}/news/edit-news/save-value/${news_id}`,
        {
          method: "post",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: titleValue,
            description: descriptionValue,
            content: contentValue,
          }),
        }
      );
      const data = await response.json();
      setIsError(data.messages);
    } catch (error) {
      setIsError(true);
      console.log("error: ", error);
    } finally {
      setIsSaving(false);
    }
  };

  const {debounceEffect:debounceAutoSave,cancelDebounce} = useDebounce(autoSave, 3000);

  useEffect(() => {
    if (
      titleValue !== originalValue.title ||
      descriptionValue !== originalValue.description ||
      contentValue !== originalValue.content
    ) {
      debounceAutoSave();
    }
    return ()=>{cancelDebounce()}
  }, [titleValue, descriptionValue, contentValue,contentValue]);
  useEffect(() => {
    console.log("titleValue: ", titleValue);
    console.log("descriptionValue: ", descriptionValue);
    console.log("contentValue: ", contentValue);
    console.log("isSaving: ", isSaving);
    console.log("cover Path: ", coverValue);
  }, [titleValue, descriptionValue, contentValue, isSaving, coverValue]);
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${baseURL}/news/get-news/${news_id}`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          method: "Get",
        });
        const data = await response.json();
        setNewsValue(data.news);
        setTitleValue(data.news.name_news || "");
        setDescriptionValue(data.news.description);
        setCoverValue(data.news.cover);
        setContentValue(data.news.content);
        setOriginalValue({
          title: data.news.name_news || "",
          description: data.news.description,
          content: data.news.content
        });
        console.log(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    document.querySelector('.ql-editor')?.setAttribute('spellcheck','false')
    fetchNews();
  }, [news_id]);
  // fetch gambar
  //
  const uploadCover = async (formData: FormData) => {
    try {
      const response = await fetch(
        `${baseURL}/news/edit-news/save-cover/${news_id}/cover`,
        { method: "post", credentials: "include", body: formData }
      );
      const data = await response.json();
      setCoverValue(data.filePath);
      setIsError(data.messages ? "Upload cover success" : data.messages);
    } catch (error) {
      setIsError("Error try again");
    }
  };

  function handleSaveCover(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const formData = new FormData();
      formData.append("cover", event.target.files[0]);
      uploadCover(formData);
    }
  }
  // fetch text

  const handlePublish = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${baseURL}/news/edit-news/publish/${news_id}`,
        {
          method: "post",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setModalValidation(true);
        setValidation(data.messages||null);
      }
      else{
        setModalValidation(true);
        setValidation(data.messages||null);
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <>
      <form onSubmit={handlePublish} className="mx-auto w-full">
        <label htmlFor="title"></label>
        <textarea
          rows={1}
          ref={inputTitleRef}
          maxLength={50}
          id="title"
          value={titleValue}
          onBlur={autoSave}
          onChange={(e) => {
            setTitleValue(e.currentTarget.value);
            e.currentTarget.style.height = "auto";
            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
            setIsSaving(true);
          }}
          style={{ height: inputTitleRef.current?.scrollHeight }}
          className={`w-full outline-none rounded-lg px-7 py-3 text-5xl resize-none text-center bg-[#FFE9CE] dark:bg-gray-600/40`}
        />
        <div
          className={`bg-black flex-col text-white w-3/4 h-fit min-h-96 mx-auto rounded-lg my-4 flex justify-center items-center text-7xl`}
        >
          {coverValue ? (
            <div className="relative w-full h-full">
              <img
              src={`${baseURL}${coverValue}`}
              className="w-full h-full bg-cover"
            />
            <label htmlFor="change-img" className="bg-oceanBlue py-1 px-3 rounded-md cursor-pointer text-base absolute top-2 right-2">Change Image
            <input
            id="change-img"
                type="file"
                accept="image/*"
                onChange={handleSaveCover}
                className={`hidden`}
              />
              </label>
            </div>
          ) : (
            <>
              <FaRegNewspaper />
              
            <label htmlFor="add-img" className="bg-oceanBlue py-1 px-3 rounded-md cursor-pointer text-base">Add Image
            <input
            id="add-img"
                type="file"
                accept="image/*"
                onChange={handleSaveCover}
                className={`hidden`}
              />
              </label>
              
            </>
          )}
        </div>
        <label htmlFor="desc">Description</label>
        <textarea
          maxLength={150}
          id="desc"
          value={descriptionValue}
          onBlur={autoSave}
          onChange={(e) => {
            setDescriptionValue(e.currentTarget.value);
            e.currentTarget.style.height = "auto";
            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
            setIsSaving(true);
          }}
          style={{ height: inputTitleRef.current?.scrollHeight }}
          className={`w-full text-center resize-none outline-none rounded-lg px-7 py-3 italic bg-[#FFE9CE] dark:bg-gray-600/40`}
        />
        <label htmlFor="Content">Content</label>
        {contentValue.length === 0 ? (
          <p className="text-center text-red-500">Content Cannot be empty</p>
        ) : null}
        <ReactQuill
          value={contentValue}
          onBlur={autoSave}
          onChange={(value) => {
            setContentValue(value);
            setIsSaving(true);
          }}
          theme="snow"
        />
        <div className="my-3 flex gap-3">
          <button type="submit" className="px-3 py-1 bg-green-500 rounded-md">
            Publish
          </button>
          <button
            type="button"
            className="px-2 py-1 bg-red-500 rounded-md"
            onClick={() => setModalDelete(true)}
          >
            Delete
          </button>
        </div>
      </form>
    </>
  );
}
export default FormEditNews;

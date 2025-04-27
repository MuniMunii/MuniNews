import { useUser } from "../../context/context";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import "../../style/animation.css"
import useFetch from "../../hook/useFetch";
import { Helmet } from "react-helmet";
function EditProfile() {
  // const [userState, setUserState] = useState<Userkey>();
  const [nameState, setNameState] = useState<string|undefined>("");
  const [error, setError] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState<string>("");
  const [descriptionState, setDescriptionState] = useState<string|undefined>("");
  const [instagramState, setInstagramState] = useState<string|undefined>("");
  const [facebookState, setFacebookState] = useState<string|undefined>("");
  const [twitterState, setTwitterState] = useState<string|undefined>("");
  const [imageState, setImageState] = useState<string|undefined>("");
  const [passwordState, setPasswordState] = useState<string>("");
  const [popUpMessage, setPopUpMessage] = useState<Boolean>(false);
  const { user } = useUser();
  const navigate=useNavigate()
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const regexPassword = /^(?=.*\d)(?=.*[A-Z])[A-Za-z\d]{5,16}$/;
  const { value: userState, isLoading: isLoading } = useFetch<Userkey>(
    `/user/get-user/${user}`,
    (data) => data.user as Userkey,
    "GET"
  );
//   debug
  useEffect(() => {
    setNameState(userState?.nama_user)
    setDescriptionState(userState?.description)
    setFacebookState(userState?.facebook)
    setTwitterState(userState?.twitter)
    setInstagramState(userState?.instagram)
    setImageState(userState?.image)
  }, [userState]);
  useEffect(()=>{
    let timer: NodeJS.Timeout;
    timer=setTimeout(()=>{setPopUpMessage(false)},3000)
    return ()=>clearTimeout(timer)
  },[popUpMessage])
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('submitted')
    e.preventDefault();
      try {
        if (!nameState?.trim() || nameState?.length === 0) {
          setPopUpMessage(true);
          return setErrorMessages("Name cannot be empty");
        }
        if (
          passwordState&&!regexPassword.test(passwordState)
        ) {
          setPopUpMessage(true);
          return setErrorMessages("Password not match");
        }
      const response = await fetch(`${baseURL}/user/update-user/${userState?.id}`, {
        method: "post",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_user: nameState,
          description: descriptionState,
          instagram: instagramState,
          facebook: facebookState,
          password:passwordState,
          twitter: twitterState,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setErrorMessages(data.messages);
        setPopUpMessage(true);
        setError(false);
        setTimeout(()=>{navigate(`/${user}/dashboard`)},3000)
      }
      else{
        setErrorMessages('Error occured');
        setPopUpMessage(true);
        
      }
    } catch (error) {
      console.log("error post", error);
    }
  };
  
    function handleSaveCover(event: React.ChangeEvent<HTMLInputElement>) {
      if (event.target.files) {
        const formData = new FormData();
        formData.append("user", event.target.files[0]);
        ChangeCover(formData);
      }
    }
  const ChangeCover=async(formData:FormData)=>{
    try{
        const response=await fetch(`${baseURL}/user/update-user/change-image/${userState?.id}/user`,{method:'post',credentials:'include',body:formData})
        const data=await response.json()
        if(response.ok){
            setImageState(data.path)
            setErrorMessages(data.messages)
            setPopUpMessage(true)
        }
    }catch(error){console.log('error changing image',error)}
  }
  return (
    <>
    <Helmet>
              <title>Edit | {user}</title>
        </Helmet>
      <AnimatePresence initial={false}>
        {popUpMessage ? (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed w-full h-fit top-0 flex justify-center z-20"
          >
            <div className="max-w-[500px] w-full h-fit p-3 bg-slate-50 text-black border border-gray-600 rounded-b-md flex flex-col items-center">
              <p className="text-center">{errorMessages}</p>
              <p className="text-sm text-red-600">
                This Message will close automatic
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="w-full h-full flex justify-center items-center py-4 dotted-without-mask">
        <form
          onSubmit={handleSubmit}
          className="max-w-[500px] min-w-80 w-3/5 border rounded-md dark:bg-darkTheme bg-white  border-gray-600 h-full p-3 flex flex-col"
        >
            <div className="w-full justify-center items-center flex flex-col gap-2">
            {imageState?<img src={`${baseURL}${imageState}`} className="size-20 rounded-full object-cover"></img>:<div className="size-20 rounded-full bg-black"></div>}
            <label htmlFor="add-img" className="font-Poppins bg-lightOrange dark:bg-oceanBlue py-1 px-3 rounded-md cursor-pointer text-base w-fit">{imageState?'Change image':'Add Image'}
            <input
            id="add-img"
                type="file"
                accept="image/*"
                onChange={handleSaveCover}
                className={`hidden`}
              />
              </label>
              </div>
          <label htmlFor="name" className="text-2xl font-bold before:content-['*'] before:text-red-500 relative">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={nameState||""}
            placeholder="Input Username"
            onChange={(e) => setNameState(e.target.value)}
            className="w-full h-10 border text-black border-gray-600 rounded-md px-2 my-2"
          />
          <label htmlFor="description" className="text-2xl font-bold">
            Description
          </label>
          <input
            type="text"
            id="description"
            maxLength={300}
            placeholder="Tell other about yourself"
            value={descriptionState}
            onChange={(e) => setDescriptionState(e.target.value)}
            className="w-full h-10 resize-none border text-black border-gray-600 rounded-md px-2 my-2"
          />
          <label htmlFor="changepass" className="text-2xl font-bold">
            Change Password
          </label>
          <input
            type="text"
            id="changepass"
            maxLength={50}
            placeholder="Change Password"
            onChange={(e) => setPasswordState(e.target.value)}
            className="w-full h-10 resize-none border text-black border-gray-600 rounded-md px-2 my-2"
          />
          <h1 className="text-center text-2xl">Social media</h1>
          <label htmlFor="facebook" className="text-1xl font-bold">
            Facebook
          </label>
          <input
            type="text"
            id="facebook"
            value={facebookState}
            placeholder="Link facebook"
            onChange={(e) => setFacebookState(e.target.value)}
            className="w-full h-10 border text-black border-gray-600 rounded-md px-2 my-2"
          />
          <label htmlFor="instagram" className="text-1xl font-bold">
            Instagram
          </label>
          <input
            type="text"
            id="instagram"
            value={instagramState}
            placeholder="Link instagram"
            onChange={(e) => setInstagramState(e.target.value)}
            className="w-full h-10 border text-black border-gray-600 rounded-md px-2 my-2"
          />
          <label htmlFor="X" className="text-1xl font-bold">
            X
          </label>
          <input
            type="text"
            id="X"
            value={twitterState}
            placeholder="Link X"
            onChange={(e) => setTwitterState(e.target.value)}
            className="w-full h-10 border text-black border-gray-600 rounded-md px-2 my-2"
          />
          <div className="flex gap-2 my-2">
            <button
              type="submit"
              className="w-full border border-hotOrange hover:bg-hotOrange dark:border-oceanBlue dark:hover:bg-oceanBlue transition duration-200 text-black dark:text-white  rounded-md px-2 py-1 "
            >
              Save
            </button>
            <Link
              to={`/${user}/dashboard`}
              className="w-full border text-black dark:text-white border-gray-600 rounded-md px-2 py-1 text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
export default EditProfile;

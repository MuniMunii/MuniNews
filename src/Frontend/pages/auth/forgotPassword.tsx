import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Helmet } from "react-helmet";
function ForgotPassword() {
  const [error, setError] = useState<string>('');
  const [emailUser, setEmailUser] = useState<string>("");
  const regexEmail =/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;  ;
  const isEmailValid = regexEmail.test(emailUser);
  const baseURL=process.env.REACT_APP_BACKEND_URL
  const navigate=useNavigate()
  const handleSubmit=async (e:any)=>{
    e.preventDefault()
    try{
    const response=await fetch(`${baseURL}/auth/forgot-password`,{
        method:'post',
        credentials:'include',
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify({email:emailUser})
    })
    if(response.ok){
    const data=await response.json()
    setError((prev)=>prev=data.messages)
    }
}
    catch(error){
        setError('Reset Password failed')
    }
  }
  function handleEmail(value: string) {
    setEmailUser(value);
  }
  return (
    <>
    <Helmet>
    <title>Forgot Password</title>
</Helmet>
    <div
      className={`dotted-without-mask w-full h-full flex justify-center items-center text-black border-t border-t-darkTheme dark:border-gray-600 `}
    >
      <div
        className={`w-[70%] max-w-96 h-fit p-6 flex flex-col items-center justify-start rounded-md z-10 bg-lightOrange shadow-cornerStampLight dark:bg-dark400 dark:shadow-cornerStampDark `}
      >
        <form onSubmit={handleSubmit} className="w-full" autoComplete="false">
          <h2 className="font-mono text-3xl text-center uppercase font-semibold">
            Reset Password
          </h2>
          <div className="flex flex-col justify-betweens h-full">
          {error?<p className="font-mono text-center text-red-500">{error}</p>:''}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="uppercase font-semibold font-mono text-2xl"
              >
                Input Email
              </label>
              <input
                className={`h-8 w-full border rounded px-2 focus:outline-none ${
                  isEmailValid ? " border-green-500" : "border-red-500"
                }`}
                type="email"
                id="email"
                placeholder="Input password"
                onInput={(value) => {
                  handleEmail(value.currentTarget.value);
                }}
              />
              <button
                type="submit"
                className={`w-full h-fit py-1 px-4 transition hover:translate-x-1 bg-mediumOrange dark:bg-blue-300 hover:translate-y-1 font-mono uppercase `}
              >
                Reset password
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
export default ForgotPassword;

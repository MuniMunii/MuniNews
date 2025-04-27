import { useParams,useNavigate } from "react-router-dom";
import { useState } from "react";
import { Helmet } from "react-helmet";
function ResetPassword() {
  const {token}=useParams()
  const navigate=useNavigate()
  const [error, setError] = useState<string>('');
  const [passwordUser, setPasswordUser] = useState<string>("");
  const [verifyUser, setNewVerifyUser] = useState<string>("");
  const regexPassword = /^(?=.*\d)(?=.*[A-Z])[A-Za-z\d]{5,16}$/;
  const isPasswordValid = regexPassword.test(passwordUser);
  const isPasswordSame=passwordUser===verifyUser
  const baseURL=process.env.REACT_APP_BACKEND_URL
  const handleSubmit=async (e:any)=>{
    e.preventDefault()
    try{
    const response=await fetch(`${baseURL}/auth/reset-password/${token}`,{
        method:'post',
        headers: {
          "Content-Type": "application/json",
        },
        credentials:'include',
        body:JSON.stringify({newPassword:passwordUser,verifyPassword:verifyUser})
    })
    if(response.ok){
      const data=await response.json()
    setError(data.messages)
    setTimeout(()=>navigate('/login'),3000)
    }
  }catch(error){
      setError('error set up new password')
    }
  }
  function handlePassword(value: string) {
    setPasswordUser(value);
  }
  function handleNewPassword(value: string) {
    setNewVerifyUser(value);
  }
  return (
    <>
    <Helmet>
    <title>Reset Password</title>
</Helmet>
    <div
      className={`dotted-without-mask w-full h-full flex justify-center items-center text-black border-t border-t-darkTheme dark:border-gray-600 `}
    >
      <div
        className={`w-[70%] max-w-96 h-fit p-6 flex flex-col items-center justify-start rounded-md z-10 bg-lightOrange shadow-cornerStampLight dark:bg-dark300 dark:shadow-cornerStampDark `}
      >
        <form onSubmit={handleSubmit} className="w-full" autoComplete="noo">
          <h2 className="font-mono text-3xl text-center uppercase font-semibold">
            Reset Password
          </h2>
          {error?<p className="font-mono text-center text-red-500">{error}</p>:''}
          <div className="flex flex-col justify-betweens h-full">
            <div className="flex flex-col gap-2">
                {!isPasswordValid&&<p className="font-mono text-center text-red-500">Password must have 5-16 letter and contain 1 Uppercase and Number</p>}
              <label
                htmlFor="new-password"
                className="uppercase font-semibold font-mono text-2xl"
              >
                New Password
              </label>
              <input
              autoComplete="nooo"
                className={`h-8 w-full border rounded px-2 focus:outline-none ${
                  isPasswordValid ? " border-green-500" : "border-red-500"
                }`}
                type="password"
                id="new-password"
                placeholder="Input password"
                onInput={(value) => {
                  handlePassword(value.currentTarget.value);
                }}
              />
              {!isPasswordSame||typeof verifyUser==='undefined' ?<p className="font-mono text-center text-red-500">Password not match</p>:''}
              <label
                htmlFor="verify-password"
                className="uppercase font-semibold font-mono text-2xl"
              >
                Verify Password
              </label>
              <input
              autoComplete="nooo"
                className={`h-8 w-full border rounded px-2 focus:outline-none ${
                  isPasswordSame ? "border-green-500" : "border-red-500"
                }`}
                type="password"
                id="verify-password"
                placeholder="Input again password"
                onInput={(value) => {
                  handleNewPassword(value.currentTarget.value);
                }}
              />
              <button
                type="submit"
                className={`w-full h-fit py-1 px-4 transition hover:translate-x-1 hover:translate-y-1 font-mono uppercase bg-mediumOrange dark:bg-blue-300 `}
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
export default ResetPassword;

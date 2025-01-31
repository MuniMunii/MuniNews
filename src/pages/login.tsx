import { useState } from "react";
import { useTheme } from "../Frontend/context/context";
type errorParam="Email Invalid"
function LoginForm() {
    const [emailUser,setEmailUser]=useState<string>('')
    const [errorEmail,setErrorEmail]=useState<boolean>(false)
    const {theme}=useTheme()
    function handleEmail(email:string){
        const regexEmail=/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        setEmailUser(email.trim())
        setErrorEmail(!regexEmail.test(email.trim()))
    }
  return <>
  <div className="bg-pink-200 w-full h-full flex justify-center items-center text-black">
  {emailUser}
  {errorEmail&&<p>email invalid</p>}
    <div className="bg-pink-300 w-[70%] max-w-96 h-96 p-6 flex flex-col items-center">
        <form>
            
            <input type="email" placeholder="input email" onInput={(value)=>{handleEmail(value.currentTarget.value)}}></input>
        </form>
    </div>
  </div>
  </>;
}
export default LoginForm;

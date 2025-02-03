import { useEffect, useState } from "react";
import { useTheme } from "../Frontend/context/context";
import useFetch from "../Frontend/hook/useFetch";
import { redirect, useNavigate } from "react-router-dom";
type errorParam = "Email Invalid";
function RegisterForm() {
  const { theme, assignUser, user } = useTheme();
  const [emailUser, setEmailUser] = useState<string>("");
  const [passwordUser, setPasswordUser] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loginAs, setLoginAs] = useState<string>("");
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const isLight=theme==='light'
  const isEmailValid=true
  const isPasswordValid=true
  function handleEmail(e:any){}
  function handleSubmit(e:any){}
  function handlePassword(e:any){}
  return (
    <>
<div className={`w-full h-full flex justify-center items-center text-black border-t ${isLight?'border-t-darkTheme':'border-t-white'}`}>
        {error}
        <div className={`bg-pink-300 w-[70%] max-w-96 h-96 p-6 flex flex-col items-center`}>
          <form onSubmit={handleSubmit}>
          {!isEmailValid && <p>email invalid</p>}
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="input email"
              onInput={(value) => {
                handleEmail(value.currentTarget.value);
              }}
            ></input>
            <br />
            <br />
            {!isPasswordValid?<p>Password Must Contain Number and Uppercase</p>:''}
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="Input password"
              onInput={(value) => {
                handlePassword(value.currentTarget.value);
              }}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}
export default RegisterForm;

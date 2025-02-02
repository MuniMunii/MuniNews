import { useEffect, useState } from "react";
import { useTheme } from "../Frontend/context/context";
import useFetch from "../Frontend/hook/useFetch";
import { redirect, useNavigate } from "react-router-dom";
type errorParam = "Email Invalid";
function LoginForm() {
  const { theme, assignUser, user } = useTheme();
  const [emailUser, setEmailUser] = useState<string>("");
  const [passwordUser, setPasswordUser] = useState<string>("");
  const [errorEmail, setErrorEmail] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loginAs, setLoginAs] = useState<string>("");
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  // useEffect(() => {
  //   console.log(token);
  // }, [token]);
  useEffect(() => {
    if(token){
      assignUser(loginAs);
      console.log(loginAs);
    }else{
      assignUser('')
    }
  }, [loginAs]);
    const regexEmail =/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const isEmailValid=regexEmail.test(emailUser)
    const regexPassword=/^(?=.*\d)(?=.*[A-Z])[A-Za-z\d]{5,16}$/
    const isPasswordValid=regexPassword.test(passwordUser)
  function handleEmail(email: string) {
    setEmailUser(email.trim());
    setErrorEmail(!regexEmail.test(email.trim()));
  }
  function handlePassword(password: string) {
    setPasswordUser(password);
  }
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const isLogin = localStorage.getItem("token");
    if (isLogin) {
      console.log("you are already login");
    } else if(isEmailValid&&isPasswordValid) {
      try {
        const response = await fetch(`${baseURL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailUser, password: passwordUser }),
        });
        const data = await response.json();
        if (response.ok) {
          setToken(data.token);
          setLoginAs(data.name);
          localStorage.setItem("token", data.token);
          //  navigate('/')
        } else {
          setError(data.messages);
        }
      } catch {
        console.log("login failed");
        setError("Login failed try again");
      }
    }
    else{
      if(!isEmailValid){
        setError('Email Invalid')
      }
      else if(!isPasswordValid){
        setError('Password Invalid')
      }
      else{
        setError('Input The Form')
      }
    }
  };
  console.log(`email: ${emailUser} password:${passwordUser}`);
  return (
    <>
      <div className="bg-pink-200 w-full h-full flex justify-center items-center text-black">
        {error}
        <div className="bg-pink-300 w-[70%] max-w-96 h-96 p-6 flex flex-col items-center">
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
export default LoginForm;

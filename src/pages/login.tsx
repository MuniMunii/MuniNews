import { useEffect, useRef, useState } from "react";
import { useTheme } from "../Frontend/context/context";
import useFetch from "../Frontend/hook/useFetch";
import { redirect, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
type errorParam = "Email Invalid";
function LoginForm() {
  const { theme, assignUser, user } = useTheme();
  const [emailUser, setEmailUser] = useState<string>("");
  const [passwordUser, setPasswordUser] = useState<string>("");
  const [errorEmail, setErrorEmail] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loginAs, setLoginAs] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const isLight = theme === "light";
  const inputPassRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (inputPassRef.current) {
      inputPassRef.current.type = showPassword ? "text" : "password";
    }
  }, [showPassword]);
  // debug
  // useEffect(() => {
  //   if (loginAs) {
  //     assignUser(loginAs);
  //     console.log(loginAs);
  //   } else {
  //     assignUser("");
  //   }
  // }, [loginAs]);
  const regexEmail =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const isEmailValid = regexEmail.test(emailUser);
  const regexPassword = /^(?=.*\d)(?=.*[A-Z])[A-Za-z\d]{5,16}$/;
  const isPasswordValid = regexPassword.test(passwordUser);
  function handleEmail(email: string) {
    setEmailUser(email.trim());
    setErrorEmail(!regexEmail.test(email.trim()));
  }
  function handlePassword(password: string) {
    setPasswordUser(password);
  }
  function handleShowPassword() {
    console.log("test");
    setShowPassword((prev) => !prev);
  }
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("submit is delivered");
    if (isEmailValid && isPasswordValid) {
      try {
        console.log("try to fetch");
        const response = await fetch(`${baseURL}/auth/login`, {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailUser, password: passwordUser }),
          credentials: "include",
        });
        console.log(response);
        const data = await response.json();
        if (response.ok) {
          // debug
          setLoginAs(data.name);
          localStorage.setItem("user", data.name);
          //  navigate('/')
        } else {
          setError(data.messages);
        }
      } catch {
        console.log("login failed");
        setError("Login failed try again");
      }
    } else {
      if (!isEmailValid) {
        setError("Email Invalid");
      } else if (!isPasswordValid) {
        setError("Password Invalid");
      } else {
        setError("Input The Form");
      }
    }
  };
  console.log(`email: ${emailUser} password:${passwordUser}`);
  return (
    <>
      <div
        className={`dotted-without-mask w-full h-full flex justify-center items-center text-black border-t ${
          isLight ? "border-t-darkTheme" : "border-t-white"
        }`}
      >
        <div
          className={`w-[70%] max-w-96 h-[450px] p-6 flex flex-col items-center rounded-md z-10 ${
            isLight
              ? "bg-lightOrange shadow-cornerStampLight"
              : "bg-dark400 shadow-cornerStampDark"
          }`}
        >
          <form onSubmit={handleSubmit} className="w-full">
            <h2 className="font-mono text-3xl text-center uppercase font-semibold">Login</h2>
            {error && (
              <p className="font-mono text-center text-red-500 text-2xl">
                {error}
              </p>
            )}
            <div className="flex flex-col justify-betweens h-full">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-semibold uppercase font-mono text-2xl"
              >
                Email
              </label>
              <input
                className={`h-8 w-full border rounded px-2 focus:outline-none focus:border-pink-900 ${
                  error ? "border-red" : ""
                }`}
                type="email"
                id="email"
                placeholder="input email"
                onInput={(value) => {
                  handleEmail(value.currentTarget.value);
                }}
              ></input>
              {!isPasswordValid ? (
                <p>Password Must Contain Number and Uppercase</p>
              ) : (
                ""
              )}
              <label
                htmlFor="password"
                className="uppercase font-semibold font-mono text-2xl"
              >
                Password:
              </label>
              <input
                className={`h-8 w-full border rounded px-2 focus:outline-none focus:border-pink-900 ${
                  error ? "border-red" : ""
                }`}
                ref={inputPassRef}
                type="password"
                id="password"
                placeholder="Input password"
                onInput={(value) => {
                  handlePassword(value.currentTarget.value);
                }}
              />
              <div className="flex items-center gap-2 font-mono">
                <button type="button" onClick={() => handleShowPassword()}>
                  <span>{showPassword?'Hide':'Show'}</span> Password
                </button>
              </div>
            </div>
            <div className="mt-auto w-full flex flex-col gap-3 font-mono font-semibold tracking-wide">
            <button type="submit" className={`w-full h-fit py-1 px-4 bg-slate-100 transition hover:translate-x-1 hover:translate-y-1 ${isLight?'bg-mediumOrange':'bg-blue-300'}`}>Login</button>
            <Link to={'/forgot-password'} className={`w-full h-fit py-1 px-4 bg-slate-200 text-center transition hover:translate-x-1 hover:translate-y-1 ${isLight?'bg-hotOrange':'bg-blue-400'}`}>Register</Link>
            <Link to={'/forgot-password'} className={`w-full h-fit py-1 px-4 bg-slate-200 text-center transition hover:translate-x-1 hover:translate-y-1 ${isLight?'bg-hotOrange':'bg-blue-500'}`}>Forgot Password</Link>
            </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
export default LoginForm;

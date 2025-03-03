import { useEffect, useRef, useState } from "react";
import { useTheme, useUser } from "../../context/context";
import useFetch from "../../hook/useFetch";
import { redirect, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
type errorParam = "Email Invalid";
function LoginForm() {
  const {assignUser, user,assignIsAuthentication,assignRole}=useUser()
  const [role,setRole]=useState<string>('')
  const [isAuthenticated,setIsAuthenticated]=useState<boolean>(false)
  const [emailUser, setEmailUser] = useState<string>("");
  const [passwordUser, setPasswordUser] = useState<string>("");
  const [errorEmail, setErrorEmail] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loginAs, setLoginAs] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const inputPassRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (inputPassRef.current) {
      inputPassRef.current.type = showPassword ? "text" : "password";
    }
  }, [showPassword]);
  // useEffect untuk assign user ke context
  useEffect(()=>{console.log('user Role',role)},[role])
  useEffect(() => {
    if (isAuthenticated) {
      assignUser(loginAs);
      assignIsAuthentication(isAuthenticated)
      assignRole(role)
    } else {
      assignUser("");
      assignIsAuthentication(false)
      assignRole("")
    }
  }, [isAuthenticated]);
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
    setShowPassword((prev) => !prev);
  }
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (isEmailValid && isPasswordValid) {
      try {
        const response = await fetch(`${baseURL}/auth/login`, {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailUser, password: passwordUser }),
          credentials: "include",
        });
        const data:UserStatus = await response.json();
        if (response.ok) {
          setLoginAs(data.name);
          setIsAuthenticated(data.isAuth)
          setRole(data.role)
          console.log(data)
          localStorage.setItem("user", data.name);
          navigate('/')
        } else {
          setError((prev)=>prev=data.messages);
        }
      } catch {
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
  const testFetchWithLogin=async ()=>{
    try{
      const response=await fetch(`${baseURL}/auth/user-token`,{
        credentials:'include'
      })
      const data=await response.json()
      console.log(data)
    }catch(error){
      console.log(error)
    }
  }
  return (
    <>
      <div
        className={`dotted-without-mask w-full h-full flex justify-center items-center text-black border-t border-t-darkTheme dark:border-gray-600 `}
      >
        <div
          className={`w-[70%] max-w-96 h-fit min-h-[450px] p-6 flex flex-col items-center justify-around rounded-md z-10 bg-lightOrange shadow-cornerStampLight dark:bg-dark400 dark:shadow-cornerStampDark`}
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
                Email:
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
            <div className="mt-4 w-full flex flex-col gap-3 font-mono font-semibold tracking-wide">
            <button type="submit" className={`w-full h-fit py-1 px-4 transition hover:translate-x-1 hover:translate-y-1 bg-mediumOrange dark:bg-blue-300`}>Login</button>
            <Link to={'/register'} className={`w-full h-fit py-1 px-4 text-center transition hover:translate-x-1 hover:translate-y-1 bg-hotOrange dark:bg-blue-400`}>Register</Link>
            <Link to={'/forgot-password'} className={`w-full h-fit py-1 px-4  text-center transition hover:translate-x-1 hover:translate-y-1 bg-hotOrange dark:bg-blue-500`}>Forgot Password</Link>
            {/* <button type="button" onClick={()=>testFetchWithLogin()} className={`w-full h-fit py-1 px-4 transition hover:translate-x-1 hover:translate-y-1 ${isLight?'bg-mediumOrange':'bg-blue-300'}`}>Test Fetch With Login</button> */}
            </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
export default LoginForm;

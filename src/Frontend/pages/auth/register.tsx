import { useEffect, useState } from "react";
import { useTheme } from "../../context/context";
import useFetch from "../../hook/useFetch";
import { redirect, useNavigate, Link } from "react-router-dom";
import { verify } from "crypto";
function RegisterForm() {
  const { theme } = useTheme();
  const [emailUser, setEmailUser] = useState<string>("");
  const [passwordUser, setPasswordUser] = useState<string>("");
  const [verifyPassword, setVerifyPasswordUser] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const isLight = theme === "light";
  const isPasswordSame = passwordUser === verifyPassword;
  const regexEmail =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const regexPassword = /^(?=.*\d)(?=.*[A-Z])[A-Za-z\d]{5,16}$/;
  const isEmailValid = regexEmail.test(emailUser);
  const isPasswordValid = regexPassword.test(passwordUser);
  function handleEmail(value: string) {
    setEmailUser(value);
  }
  function handleUsername(value: string) {
    setUsername(value);
  }
  function handlePassword(value: string) {
    setPasswordUser(value);
  }
  function handleVerifyPassword(value: string) {
    setVerifyPasswordUser(value);
  }
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!isEmailValid) {
      setError("Email not valid");
      return;
    }
    if (username.length < 3) {
      setError("Username not valid");
      return;
    }
    if (!isPasswordValid || passwordUser !== verifyPassword) {
      setError("Password not valid");
      return;
    }
    if (
      passwordUser === "" &&
      emailUser === "" &&
      username === "" &&
      verifyPassword === ""
    ) {
      setError("Form cannot empty");
      return;
    }
    try {
      const response = await fetch(`${baseURL}/auth/register`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: emailUser,
          nama_user: username,
          password: verifyPassword,
          verifyPassword:verifyPassword
        }),
      });
      const data = await response.json();
      setError(data.messages);
    } catch (error) {}
  };
  return (
    <>
      <div
        className={`dotted-without-mask w-full h-full flex justify-center items-center text-black border-t ${
          isLight ? "border-t-darkTheme" : "border-t-white"
        }`}
      >
        <div
          className={`w-[70%] max-w-96 h-fit min-h-[450px] p-6 flex flex-col items-center justify-around rounded-md z-10 ${
            isLight
              ? "bg-lightOrange shadow-cornerStampLight"
              : "bg-dark400 shadow-cornerStampDark"
          }`}
        >
          <form onSubmit={handleSubmit} className="w-full" autoComplete="off">
            <h2 className="font-mono text-3xl text-center uppercase font-semibold">
              Register
            </h2>
            {error && (
              <p className="font-mono text-center text-red-500 text-2xl">
                {error}
              </p>
            )}
            <div className="flex flex-col justify-betweens h-full">
              <div className="flex flex-col gap-2">
                {emailUser !== "" && !isEmailValid && (
                  <p
                    className={`font-mono ${
                      isLight ? "text-red-800" : "text-red-500"
                    } text-center`}
                  >
                    Email not valid
                  </p>
                )}
                <label
                  htmlFor="email"
                  className="font-semibold uppercase font-mono text-2xl"
                >
                  Email:
                </label>
                <input
                  className={`h-8 w-full border rounded px-2 focus:outline-none ${
                    !isEmailValid ? "border-red-500" : "border-green-500"
                  }`}
                  autoComplete="email-off"
                  type="email"
                  id="email"
                  placeholder="input email"
                  onInput={(value) => {
                    handleEmail(value.currentTarget.value);
                  }}
                ></input>
                {username !== "" && username.length < 3 && (
                  <p
                    className={`font-mono ${
                      isLight ? "text-red-800" : "text-red-500"
                    } text-center`}
                  >
                    Username must have atleast 3 letter
                  </p>
                )}
                <label
                  htmlFor="username"
                  className="font-semibold uppercase font-mono text-2xl"
                >
                  Username:
                </label>
                <input
                  className={`h-8 w-full border rounded px-2 focus:outline-none ${
                    username.length < 3 ? "border-red-500" : "border-green-500"
                  }`}
                  autoComplete="email-off"
                  type="text"
                  id="username"
                  placeholder="input email"
                  onInput={(value) => {
                    handleUsername(value.currentTarget.value);
                  }}
                ></input>
                {passwordUser !== "" && !isPasswordValid && (
                  <p
                    className={`font-mono ${
                      isLight ? "text-red-800" : "text-red-500"
                    } text-center`}
                  >
                    Password must have atleast 5-16 letter, contain Number and
                    Uppercase
                  </p>
                )}
                <label
                  htmlFor="password"
                  className="uppercase font-semibold font-mono text-2xl"
                >
                  Password:
                </label>
                <input
                  className={`h-8 w-full border rounded px-2 focus:outline-none ${
                    !isPasswordValid ? "border-red-500" : "border-green-500"
                  }`}
                  type="password"
                  autoComplete="new-password"
                  id="password"
                  placeholder="Input password"
                  onInput={(value) => {
                    handlePassword(value.currentTarget.value);
                  }}
                />
                {verifyPassword !== "" && !isPasswordSame && (
                  <p
                    className={`font-mono ${
                      isLight ? "text-red-800" : "text-red-500"
                    } text-center`}
                  >
                    Password is not same
                  </p>
                )}
                <label
                  htmlFor="verify-password"
                  className="uppercase font-semibold font-mono text-2xl"
                >
                  Verify Password:
                </label>
                <input
                  className={`h-8 w-full border rounded px-2 focus:outline-none ${
                    !isPasswordSame
                      ? "focus:border-red-500"
                      : "border-green-500"
                  }`}
                  type="password"
                  autoComplete="new-password"
                  id="verify-password"
                  placeholder="Input password"
                  onInput={(value) => {
                    handleVerifyPassword(value.currentTarget.value);
                  }}
                />
              </div>
              <div className="mt-4 w-full flex flex-col gap-3 font-mono font-semibold tracking-wide">
                <button
                  type="submit"
                  className={`w-full h-fit py-1 px-4 transition hover:translate-x-1 hover:translate-y-1 ${
                    isLight ? "bg-mediumOrange" : "bg-blue-300"
                  }`}
                >
                  Register
                </button>
                <Link
                  to={"/login"}
                  className={`w-full h-fit py-1 px-4 text-center transition hover:translate-x-1 hover:translate-y-1 ${
                    isLight ? "bg-hotOrange" : "bg-blue-400"
                  }`}
                >
                  Login
                </Link>
                {/* <button type="button" onClick={()=>testFetchWithLogin()} className={`w-full h-fit py-1 px-4 transition hover:translate-x-1 hover:translate-y-1 ${isLight?'bg-mediumOrange':'bg-blue-300'}`}>Test Fetch With Login</button> */}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
export default RegisterForm;

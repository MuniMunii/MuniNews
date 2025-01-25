import React, { ReactNode } from "react";
import { useTheme } from "../context/theme";
import { useState, useEffect } from "react";
function Navbar() {
  const { theme} = useTheme();
  const [openNav, setopenNav] = useState<boolean>(false);
  const [animation, setAnimation] = useState<boolean>(true);
  useEffect(() => {
    let timer = setTimeout(() => {
      console.log("time nyala", openNav);
      setAnimation(!animation);
    }, 200);
    return () => clearTimeout(timer);
  }, [openNav]);
  const AnimationNav =({className,children}:{className:string,children:ReactNode})=>{
    let duration=50
    return (
        <>
        {React.Children.map(children,(child)=>{
            if(React.isValidElement<{className:string}>(child)){
                duration+=50
                const classIsExist=child.props.className||''
                return React.cloneElement(child,{className:`${classIsExist}${className} duration-${duration}`.trim()})
            }
            return child
        })}
        </>
    )
  }
  return (
    <div
      className={`w-full h-20 p-4 flex justify-between items-center ${
        theme === "light" ? "text-blue-300" : "text-pink-300 bg-darkTheme"
      }`}
    >
      <h1 className="text-5xl">Title</h1>
      {/* <button className="" onClick={toggleTheme}>change theme</button> */}
      <button onClick={() => setopenNav(true)}>Menu</button>
      {openNav && (
        <div
          className={`fixed top-0 left-0 w-full h-full bg-white/40 backdrop-blur-sm z-50 overflow-hidden transition ease-linear duration-100 ${
            animation ? "opacity-100" : "opacity-0"
          }`}
        >
          <button onClick={() => setopenNav(false)}>Menu</button>
          <div className="flex flex-col">
          <AnimationNav className={`text-black transition ${animation ? "translate-x-0" : "translate-x-full"}`}>
          <a>test</a>
          <a>test</a>
          <a>test</a>
          <a>test</a>
          <a>test</a>
          </AnimationNav>
          </div>
        </div>
      )}
    </div>
  );
}
export default Navbar;

import { useContext, useState, createContext, useEffect,ReactNode } from "react";
const ThemeContext = createContext({
  theme: "dark",
  isWideScreen:false,
  toggleTheme: () => {},
  user:'',
  assignUser:(user:string)=>{}
});
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });
  const [isWideScreen,setIsWideScreen]=useState<boolean>(false)
  const [user,setUser]=useState<string>('')
  // useEffect buat breakpoint devices < 768
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px) and (min-height: 500px)');
    const handleMediaQueryChange = (event:MediaQueryListEvent) => {
      setIsWideScreen(event.matches);
    };
    mediaQuery.addEventListener('change', handleMediaQueryChange);
    if(mediaQuery.matches){
      setIsWideScreen(true)
    }
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);
  // useEffect buat ganti theme
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const assignUser=(user:string)=>{
    console.log("Assigning user:", user);
    setUser(user)
  }
  return <ThemeContext.Provider value={{theme,toggleTheme,isWideScreen,user,assignUser}}>{children}</ThemeContext.Provider>;
}
export function useTheme() {
    return useContext(ThemeContext);
  }

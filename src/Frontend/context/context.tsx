import { useContext, useState, createContext, useEffect,ReactNode } from "react";
const ThemeContext = createContext({
  theme: "dark",
  isWideScreen:false,
  toggleTheme: () => {},
  user:'',
  assignUser:(user:string)=>{},
});
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });
  const [isWideScreen,setIsWideScreen]=useState<boolean>(false)
  const [user,setUser]=useState<string>(()=>localStorage.getItem('user')||"")
  const baseURL=process.env.REACT_APP_BACKEND_URL
  useEffect(()=>{console.log('user context:',user)},[user])
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
  // useEffect buat ganti theme dan keep theme
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };
  // function assignuser
  const assignUser=(user:string)=>{
    console.log("Assigning user:", user);
    setUser((prev)=>prev=user)
  }
  // function fetch profile user
  const fetchUser= async ()=>{
    try{
      const response=await fetch(`${baseURL}/auth/me`,{
        method:'get',
        credentials:'include'
      })
      if(response.ok){
        const data=await response.json()
        setUser(data.name)
        console.log('fetch login',data.name)
        localStorage.setItem('user',data.name)
      }else{
        setUser('')
        localStorage.removeItem('user')
      }
    }
    catch{
      setUser('')
      localStorage.removeItem('user')
    }
  }
  // useEffect jika user menghapus item di localstorage item akan tetap ada selama token valid dengan function fetchUser
  useEffect(()=>{
    fetchUser()
    const handleChange=(event:StorageEvent)=>{
      if(event.key==='user'){
        setUser(event.newValue||'')
      }
    }
    window.addEventListener('storage',handleChange)
    return ()=> window.removeEventListener('storage',handleChange)
  },[])
  // nanti di setting
  
  return <ThemeContext.Provider value={{theme,toggleTheme,isWideScreen,user,assignUser}}>{children}</ThemeContext.Provider>;
}
export function useTheme() {
    return useContext(ThemeContext);
  }

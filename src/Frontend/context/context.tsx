import { useContext, useState, createContext, useEffect,ReactNode } from "react";
const ThemeContext = createContext({
  theme: "dark",
  isWideScreen:false,
  toggleTheme: () => {},
  user:'',
  assignUser:(user:string)=>{},
  logout:()=>{},
});
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });
  const [isWideScreen,setIsWideScreen]=useState<boolean>(false)
  const [user,setUser]=useState<string>(()=>localStorage.getItem('user')||"")
  const baseURL=process.env.REACT_APP_BACKEND_URL
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
  // useEffect login
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
  // useEffect logout
  useEffect(()=>{
    const syncLogout=(event:StorageEvent)=>{
      if(event.key==='logout'){
        setUser('');
      }
    }
    window.addEventListener('storage',syncLogout)
    return ()=>window.addEventListener('storage',syncLogout)
  },[])
  const assignUser=(user:string)=>{
    console.log("Assigning user:", user);
    setUser(user)
  }
  // nanti di setting
  const logout = async () => {
    try{
    await fetch(`${baseURL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser("");
    localStorage.removeItem("user");
    localStorage.setItem('logout',Date.now().toString())
      setTimeout(()=>{localStorage.removeItem('logout')},1000)
  }
  catch(error){
    console.log('logout error di context',error)
  }
  };
  return <ThemeContext.Provider value={{theme,toggleTheme,isWideScreen,user,assignUser,logout}}>{children}</ThemeContext.Provider>;
}
export function useTheme() {
    return useContext(ThemeContext);
  }

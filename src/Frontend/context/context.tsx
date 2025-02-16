import { useContext, useState, createContext, useEffect,ReactNode } from "react";
const ThemeContext = createContext({
  theme: "dark",
  isWideScreen:false,
  toggleTheme: () => {},
  user:'',
  role:'',
  assignRole:(user:string)=>{},
  assignUser:(user:string)=>{},
  isAuthenticated:false,
  assignIsAuthentication:(isAuth:boolean)=>{}
});
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });
  const [role,setRole]=useState<string>('')
  const [isWideScreen,setIsWideScreen]=useState<boolean>(false)
  const [user,setUser]=useState<string>((()=>localStorage.getItem('user')||""))
  const [isAuthenticated,setIsAuthenticated]=useState<boolean>(false)
  const baseURL=process.env.REACT_APP_BACKEND_URL
  useEffect(()=>{console.log('user context:',user);console.log('auth context:',isAuthenticated);console.log('role context:',role)},[user])
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
  // function isAuthentication
  const assignIsAuthentication=(isAuth:boolean)=>{
    setIsAuthenticated((prev)=>prev=isAuth)
  }
  // function assignuser
  const assignUser=(user:string)=>{
    console.log("Assigning user:", user);
    setUser((prev)=>prev=user)
  }
  // function assign role
  const assignRole=(role:string)=>{
    setRole((prev)=>prev=role)
  }
  // function fetch profile user
  const fetchUser= async ()=>{
    try{
      const response=await fetch(`${baseURL}/auth/me`,{
        method:'get',
        credentials:'include'
      })
      if(response.ok){
        const data:UserStatus=await response.json()
        setIsAuthenticated(data.isAuth)
        setRole(data.role)
        setUser(data.name)
        console.log('user id',data.id)
        console.log('fetch login',data.name)
        console.log('fetch login',data.isAuth)
        console.log('fetch login',data.role)
        localStorage.setItem('user',data.name)
      }else{
        setUser('')
        localStorage.removeItem('user')
      }
    }
    catch{
      setIsAuthenticated(false)
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
  useEffect(()=>{},[isAuthenticated])
  return <ThemeContext.Provider value={{theme,toggleTheme,isWideScreen,user,assignUser,assignIsAuthentication,isAuthenticated,role,assignRole}}>{children}</ThemeContext.Provider>;
}
export function useTheme() {
    return useContext(ThemeContext);
  }

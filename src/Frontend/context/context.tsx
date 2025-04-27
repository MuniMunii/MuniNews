import { useContext, useState, createContext, useEffect, ReactNode, useMemo } from "react";

// Split the context into multiple contexts
const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
});

const ScreenContext = createContext({
  isWideScreen: false,
});

const UserContext = createContext({
  user: '',
  role: '',
  isAuthenticated: false,
  assignRole: (role: string) => {},
  assignUser: (user: string) => {},
  assignIsAuthentication: (isAuth: boolean) => {},
});

// Create custom hooks for each context
export function useTheme() {
  return useContext(ThemeContext);
}

export function useScreen() {
  return useContext(ScreenContext);
}

export function useUser() {
  return useContext(UserContext);
}

// Main provider component
export function AppProvider({ children }: { children: ReactNode }) {
  // This is the main provider that wraps everything
  return (
    <ScreenProvider>
      <ThemeProvider>
        <UserProvider>
          {children}
        </UserProvider>
      </ThemeProvider>
    </ScreenProvider>
  );
}

// Individual providers
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    if(theme==='light'){
      document.body.classList.remove('dark')
    }else{
      document.body.classList.add('dark')
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const themeValue = useMemo(() => ({
    theme,
    toggleTheme,
  }), [theme]);

  return <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>;
}

function ScreenProvider({ children }: { children: ReactNode }) {
  const [isWideScreen, setIsWideScreen] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsWideScreen(event.matches);
    };
    
    // Check initial state
    setIsWideScreen(mediaQuery.matches);
    
    // Set up listener
    mediaQuery.addEventListener('change', handleMediaQueryChange);
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  const screenValue = useMemo(() => ({
    isWideScreen,
  }), [isWideScreen]);

  return <ScreenContext.Provider value={screenValue}>{children}</ScreenContext.Provider>;
}

function UserProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<string>('');
  const [user, setUser] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const baseURL = process.env.REACT_APP_BACKEND_URL;

  const assignIsAuthentication = (isAuth: boolean) => {
    setIsAuthenticated(isAuth);
  };

  const assignUser = (user: string) => {
    // console.log("Assigning user:", user);
    setUser(user);
  };

  const assignRole = (role: string) => {
    setRole(role);
  };

  const fetchUser = async () => {
    try {
      const response = await fetch(`${baseURL}/auth/me`, {
        method: 'get',
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.warn("Fetch error:", data.messages);
        if (data.messages === "invalid Token please Login Again") {
          setIsAuthenticated(false);
          setUser("");
          localStorage.removeItem("user");
        }
        return;
      }
      
      if (response.ok) {
        setIsAuthenticated(data.isAuth);
        setRole(data.role);
        setUser(data.name);
        // console.log('user id', data.id);
        // console.log('fetch login', data.name);
        // console.log('fetch login', data.isAuth);
        // console.log('fetch login', data.role);
      } else {
        setUser('');
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser('');
    }
  };

  useEffect(() => {
    fetchUser();
    
    const handleChange = (event: StorageEvent) => {
      if (event.key === 'user') {
        setUser(event.newValue || '');
      }
    };
    
    window.addEventListener('storage', handleChange);
    return () => window.removeEventListener('storage', handleChange);
  }, []);

  const userValue = useMemo(() => ({
    user,
    role,
    isAuthenticated,
    assignRole,
    assignUser,
    assignIsAuthentication,
  }), [user, role, isAuthenticated]);

  return <UserContext.Provider value={userValue}>{children}</UserContext.Provider>;
}
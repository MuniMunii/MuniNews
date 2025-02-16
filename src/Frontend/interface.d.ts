import { useTheme } from "./context/context";

const {theme}=useTheme()
  declare global{
    interface window{
      isLight:boolean
    };
    interface NewsItem {
      id:string;
      title:string;
      description:string;
      url:string;
      author:string;
      published:string;
      notAnimated:boolean;
    }
    interface UserStatus{
      id:string
      name:string,
      isAuth:boolean,
      role:string,
      messages:string
    }
  }
  window.isLight=theme==='light'
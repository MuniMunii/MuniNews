import { useTheme } from "./context/context";

const { theme } = useTheme();
declare global {
  interface window {
    isLight: boolean;
  }
  interface UserStatus {
    id: string;
    name: string;
    isAuth: boolean;
    role: string;
    messages: string;
  }
  interface NewsStatus {
    news_id: string;
    messages: string;
  }
  interface NewsKey {
    news_id: string;
    name_news: string;
    createdBy: string;
    updatedAt: string;
    category: string;
    verified: boolean;
    status: statusNews;
    description: string;
    content:string;
    cover:string;
  }
  interface Userkey{
    id:string;
    nama_user:string;
    isAuth:boolean;
    role:string;
    image:string;
  }
  type statusNews="inreview"|"mynews"|"archived"|"cancelled"|"published"
}
window.isLight = theme === "light";

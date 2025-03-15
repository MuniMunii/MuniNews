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
  interface CurrentNews{
    id:string;
    title:string;
    author:string;
    language:string;
    category:string[];
    url:string;
    description:string;
    image:string;
  }
  interface PublicNews{
    article_id:string
    title:string
    link:string
    description:string
    image_url:string
    language:string
    source_name:string
  }
  interface NewsKey {
    news_id: string;
    name_news: string;
    createdBy: string;
    updatedAt: string;
    createdAt:string;
    category: Category;
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
  type Category="General"|"Politics"|"Sciences"|"Tech"|"Sport"|"Business"
}
window.isLight = theme === "light";

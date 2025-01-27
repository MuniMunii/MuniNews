import React, { useState,useEffect } from "react";
interface dataParameter {
  data: {
    news: NewsItem[];
  } | null;
  animation:boolean|null
  dataLength:number
}
const NewsCard: React.FC<dataParameter> = ({ data,animation,dataLength }) => {
  if (!data?.news) return null;

  return (
    <div className="flex w-4/5 flex-wrap justify-center gap-4">
      {data.news.map((data, index) => (
        <div
          key={data.id}
          className={`w-96 h-fit p-4 text-white ${
            data.notAnimated? "animate-pulse bg-white h-48" : ""
          }`}
        >
          {!animation? data.title : ""}
        </div>
      ))}
    </div>
  );
};
export default NewsCard;

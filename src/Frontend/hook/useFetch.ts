import React, { useEffect, useState } from "react";
function useFetch<T>(url: string,processData:(data:any)=>T){
  const [value, setValue] = useState<T|null>();
  const [isLoading, setIsLoading] = useState<boolean | null>(true);
  useEffect(()=>{
    setIsLoading(true);
    fetch(url,
      {method:'get',credentials:'include',headers:{ "Content-Type": "application/json" }}
    )
    .then((response) => response.json())
    .then((data) => {
      setValue(processData(data));
      setIsLoading(false);
    }).catch((err) => console.log(err));
  },[url])
    return { value, isLoading };
}
export default useFetch;
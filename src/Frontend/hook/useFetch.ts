import React, { useEffect, useState } from "react";
// fetch untuk external api route
function useFetch<T>(
  url: string,
  processData: (data: any) => T,
  method: "GET",
  body?: any,
  headers: Record<string, string>={}
) {
  const [value, setValue] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean | null>(true);
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    setIsLoading(true);
    fetch(`${baseURL}${url}`, {
      method,
      credentials: "include",
      headers: { ...headers },
      body: body ? JSON.stringify(body) : null,
    })
      .then((response) => response.json())
      .then((data) => {
        setValue(processData(data));
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, [url]);
  return { value, isLoading };
}
export default useFetch;

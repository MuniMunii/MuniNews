import React,{useEffect,useRef,useCallback} from "react";
export default function useDebounce(callback:(...args:any[])=>void,delay:number){
    const timeoutREf=useRef<NodeJS.Timeout|null>(null)
    const debounceEffect=useCallback((...args:any[])=>{
        if(timeoutREf.current){
            clearTimeout(timeoutREf.current);
        }
        timeoutREf.current=setTimeout(()=>{
            callback(...args)
        },delay)
    },[callback,delay])
    return debounceEffect
}
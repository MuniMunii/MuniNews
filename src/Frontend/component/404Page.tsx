import { useTheme } from "../context/context"

function PageNotFound(){
    return (
        <div className={`w-full h-full flex flex-col justify-center items-center text-6xl gap-2 font-mono`}><span className="text-red-500">404</span>Page Not Found (╥﹏╥)</div>
    )
}
export default PageNotFound
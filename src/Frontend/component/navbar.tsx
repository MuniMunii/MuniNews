import { useTheme } from "../context/theme";
function Navbar(){
    const {theme,toggleTheme}=useTheme()
    return (
    <div className={`w-full h-20 p-4 bg-gray-200 flex justify-between items-center ${theme==='light'?'text-blue-300':'text-pink-300'}`}>
        <h1 className="text-5xl">Title</h1>
        <button className="" onClick={toggleTheme}>change theme</button>
    </div>
    )
}
export default Navbar;
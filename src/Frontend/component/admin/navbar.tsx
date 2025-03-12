import { Link } from "react-router-dom";
import { useUser } from "../../context/context";
import { HiOutlineTemplate,HiOutlinePencilAlt } from "react-icons/hi";
function NavbarAdmin(){
    const {user}=useUser()
    return (
                    <div className={`w-96 h-full border-r  p-4 flex flex-col items-center justify-between font-Poppins bg-white border-gray-600 dark:bg-darkTheme text-black`}>
                        <div className="flex flex-col gap-2 w-3/4">
                        <Link to={`/${user}/dashboard`} className={`py-1 px-3 font-semibold text-black/50 hover:text-black dark:text-white/40 dark:hover:text-white transition duration-300 select-none cursor-pointer rounded-md flex items-center gap-2`}><HiOutlineTemplate/>Dashboard </Link>
                        <Link to={`/${user}/dashboard/news`} className={`py-1 px-3 font-semibold text-black/50 hover:text-black dark:text-white/40 dark:hover:text-white transition duration-300 select-none cursor-pointer rounded-md flex items-center gap-2`}><HiOutlinePencilAlt/>News</Link>
                        </div>
                        <div className={`border-t border-t-gray-600 w-full text-center py-3 dark:text-white text-sm`}>
                            <a>Admin: {user}</a>
                        </div>
                    </div>
    )
}
export default NavbarAdmin;
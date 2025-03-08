function SearchNews(){
    return (
        <div className="flex flex-col h-full min-h-screen border rounded-md border-gray-600 w-2/6 p-3 gap-4">
        <p className="text-center">Search News</p>
        <input type="text" className="w-full border border-gray-600 outline-none pl-3 py-1 rounded-full bg-transparent" placeholder="Search News..."></input>
        <div className="w-full h-full flex flex-col  border border-gray-600 rounded-md p-2 overflow-auto scrollbar-thin gap-2">
            <div className=" w-full h-fit p-1 rounded-md border border-gray-600 cursor-pointer text-sm">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam ab, maiores enim provident, velit, non tenetur culpa iste minima asperiores aliquam blanditiis rem dolor ad explicabo exercitationem adipisci deserunt ea quia expedita. Aliquid dicta deleniti omnis officia cum tempora fuga in harum similique provident dolorum obcaecati ducimus maxime, recusandae esse?</p>           
            </div>
            <div className="w-full h-fit p-1 rounded-md border border-gray-600 cursor-pointer text-sm">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam ab, maiores enim provident, velit, non tenetur culpa iste minima asperiores aliquam blanditiis rem dolor ad explicabo exercitationem adipisci deserunt ea quia expedita. Aliquid dicta deleniti omnis officia cum tempora fuga in harum similique provident dolorum obcaecati ducimus maxime, recusandae esse?</p>           
            </div>
            
        </div>
        
        </div>
    )
}
export default SearchNews
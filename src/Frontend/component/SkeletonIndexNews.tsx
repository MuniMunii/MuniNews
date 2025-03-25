function SkeletonIndexNews(){
    return (
        <div>
            <h1 className="bg-gray-600 animate-pulse rounded-full w-44 h-10"></h1>
            <div className="flex w-full mt-4 gap-2 phone:flex-col phone:items-center tablet:flex-row">
                <div className="flex flex-col tablet:w-1/2 phone:w-full border-b border-b-hotOrange dark:border-b-pastelTosca gap-2 pb-2">
                    <div className="w-full h-96 bg-gray-600 rounded-md animate-pulse"></div>
                    <div className="w-full h-5 rounded-full bg-gray-600 animate-pulse"></div>
                    <div className="w-full h-5 rounded-full bg-gray-600 animate-pulse"></div>
                    <div className="w-full h-5 rounded-full bg-gray-600 animate-pulse"></div>
                </div>
                <div className="tablet:w-1/2 phone:w-full flex flex-col gap-5">
                <div className="mx-auto bg-gray-600 rounded-md w-32 h-7 animate-pulse"></div>
                <div className="w-full h-fit flex gap-2 border-b border-b-hotOrange dark:border-b-pastelTosca pb-2">
                    <div className="size-32 bg-gray-600 animate-pulse rounded-md"></div>
                    <div className="flex flex-col w-full  gap-2">
                        <div className="w-full bg-gray-600 rounded-full h-6"></div>
                        <div className="w-full bg-gray-600 rounded-full h-6"></div>
                        <div className="w-full bg-gray-600 rounded-full h-4"></div>
                        <div className="w-full bg-gray-600 rounded-full h-4"></div>
                        <div className="w-28 bg-gray-600 rounded-full h-4"></div>
                    </div>
                </div>
                <div className="w-full h-fit flex gap-2 border-b border-b-hotOrange dark:border-b-pastelTosca pb-2">
                    <div className="size-32 bg-gray-600 animate-pulse rounded-md"></div>
                    <div className="flex flex-col w-full  gap-2">
                        <div className="w-full bg-gray-600 rounded-full h-6"></div>
                        <div className="w-full bg-gray-600 rounded-full h-6"></div>
                        <div className="w-full bg-gray-600 rounded-full h-4"></div>
                        <div className="w-full bg-gray-600 rounded-full h-4"></div>
                        <div className="w-28 bg-gray-600 rounded-full h-4"></div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}
export default SkeletonIndexNews;

function LoadingComp({ error }: { error: string | null | boolean}) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center font-semibold tracking-wider gap-2">
        <div className={`size-10 rounded-full relative animate-spin delay-75 border-2 border-black dark:border-white `}>
            <div className={`bg-pink-600 size-2 rounded-full absolute -top-1`}></div>
            <div className={`bg-pink-600 size-2 rounded-full absolute -bottom-1 -right-0`}></div>
        </div>
        <p className="font-roboto uppercase">Loading...</p>
        {error?<p className="text-red-500">Pls Try Again, Reload the page</p>:null}
    </div>
  );
}
export default LoadingComp;

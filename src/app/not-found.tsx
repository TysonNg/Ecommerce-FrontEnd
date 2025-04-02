import Image from "next/image";

export default function NotFound() {
    return (
            <div className="h-full flex flex-col items-center justify-center gap-5 ">
               <Image className="w-auto" src={"https://static-00.iconduck.com/assets.00/404-page-not-found-illustration-2048x998-yjzeuy4v.png"} height={300} width={300} alt={`NotFounPage`}/>
               <h1 className="text-5xl font-bold">Page Not Found</h1>
            </div>
    );
}
import Image from "next/image";

interface LoadingProps {
    text?: string;
}

export default function Loading({ text = "Loading the page..." }: LoadingProps) {
    return (
      <div className="bg-indigo-500 flex max-w-[230px] items-center px-4 py-2 justify-between rounded-xl m-auto mt-16 ring-1 mb-[800px]">
          <Image src="/spin-icon-1.svg" className="animate-spin" alt="" width={30} height={30} />
          <p className="text-md">{text}</p>
      </div>
    );
}

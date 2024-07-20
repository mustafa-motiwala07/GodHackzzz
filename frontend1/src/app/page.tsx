import { Chat } from "@/components/chat";
import InputFile  from "@/components/InputFile";
import Test from "@/components/Test";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative container flex min-h-screen flex-col">
      <div className="flex flex-1 py-4">
        <div className="w-full">
          <Test />
          {/* <InputFile/> */}
          {/* <Chat /> */}
        </div>
      </div>
    </main>
  );
}


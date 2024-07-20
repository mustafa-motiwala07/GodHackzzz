import { Chat } from "@/components/chat";
import Footer from "@/components/Footer";
import InputFile  from "@/components/InputFile";
import Navbar from "@/components/Navbar";
import Test from "@/components/Test";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col">
      <div className="flex flex-1 py-4">
        <div className="w-full">
          <Navbar />
          <Test />
          {/* <InputFile/> */}
          {/* <Chat /> */}
          <Footer />
        </div>
      </div>
    </main>
  );
}


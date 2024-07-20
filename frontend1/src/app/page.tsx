import { Chat } from "@/components/chat";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col">
      <div className="flex flex-1 py-4">
        <div className="w-full">
          {/* <Navbar /> */}
          <Chat />
          {/* <Footer /> */}
        </div>
      </div>
    </main>
  );
}


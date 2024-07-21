// "use client";
// import { ChatBubble } from "./chat-bubble";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Message } from "ai/react";
// import { useState } from "react";
// import axios from "axios";

// export function Chat() {
//   const [messages, setMessages] = useState<Message[]>([
//     { role: "user", content: "Hey I am the user", id: "1" },
//     { role: "assistant", content: "Hey I am your AI", id: "2" },
//   ]);
//   const sources = ["I am source one", "I am source two"];

//   const handleFormSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     const input = event.currentTarget.querySelector("input");
//     const userMessage = input?.value.trim();

//     if (userMessage) {
//       setMessages([
//         ...messages,
//         { role: "user", content: userMessage, id: `${messages.length + 1}` },
//       ]);

//       try {
//         const response = await axios.post("http://127.0.0.1:8000/run_query/", {
//           query: userMessage,
//         });
//         const aiMessage = response.data.response.result;
//         console.log(response.data.response.result);
//         // console.log(response.data);
//         setMessages([
//           ...messages,
//           { role: "user", content: userMessage, id: `${messages.length + 1}` },
//           {
//             role: "assistant",
//             content: aiMessage,
//             id: `${messages.length + 2}`,
//           },
//         ]);
//       } catch (error) {
//         console.error("Error fetching response: ", error);
//       }
//     }
//   };

//   return (
//     <div className="m-20 rounded-2xl border h-[75vh] flex flex-col justify-between">
//       <div className="p-6 overflow-auto">
//         {messages.map(({ id, role, content }: Message) => (
//           <ChatBubble
//             key={id}
//             role={role}
//             content={content}
//             sources={role !== "assistant" ? [] : sources}
//           />
//         ))}
//       </div>

//       <form className="p-4 flex clear-both" onSubmit={handleFormSubmit}>
//         <Input placeholder={"Type to chat with AI..."} className="mr-2" />
//         <Button type="submit" className="w-24">
//           Ask
//         </Button>
//       </form>
//     </div>
//   );
// }

"use client"
import { useRef, useState } from "react";
import axios from "axios";
import { ChatBubble } from "./chat-bubble"; // Import your ChatBubble component
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Message } from "ai/react";

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "user", content: "Hey I am the user", id: "1" },
    { role: "assistant", content: "Hey I am your AI", id: "2" },
  ]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null); // Reference to the input field

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const input = event.currentTarget.querySelector("input");
    const userMessage = input?.value.trim();

    if (userMessage) {
      const userMessageObject: Message = { role: "user", content: userMessage, id: `${messages.length + 1}` };
      const loadingMessageObject: Message = { role: "assistant", content: "", id: `${messages.length + 2}` };

    if (inputRef.current) {
      inputRef.current.value = ""; // Clear the input field
    }

      setMessages([...messages, userMessageObject, loadingMessageObject]);
      setLoading(true); // Start loading

      try {
        const response = await axios.post("http://127.0.0.1:8000/run_query/", {
          query: userMessage,
        });
        const aiMessage = response.data.response.result;

        // Update the loading message with the AI response
        setMessages(prevMessages =>
          prevMessages.map(message =>
            message.id === loadingMessageObject.id
              ? { ...message, content: aiMessage }
              : message
          )
        );
      } catch (error) {
        console.error("Error fetching response: ", error);
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  return (
    <div className="m-20 rounded-2xl border h-[75vh] flex flex-col justify-between">
      <div className="p-6 overflow-auto">
        {messages.map(({ id, role, content }: Message) => (
          <ChatBubble
            key={id}
            role={role}
            content={content}
            sources={role !== "assistant" ? [] : []} // Adjust sources as needed
            isLoading={role === "assistant" && loading && !content} // Pass loading state
          />
        ))}
      </div>

      <form className="p-4 flex clear-both" onSubmit={handleFormSubmit}>
      <Input placeholder={"Type to chat with AI..."} className="mr-2" ref={inputRef} />
        <Button type="submit" className="w-24">
          Ask
        </Button>
      </form>
    </div>
  );
}


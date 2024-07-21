"use client";
import { ChatBubble } from "./chat-bubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Message } from "ai/react";
import { useState } from "react";
import axios from "axios";

export function Chat() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hey I am your AI", id: "1" },
        { role: "user", content: "Hey I am the user", id: "2" },
    ]);
    const sources = ["I am source one", "I am source two"];

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const input = event.currentTarget.querySelector('input');
        const userMessage = input?.value.trim();

        if (userMessage) {
            setMessages([...messages, { role: "user", content: userMessage, id: `${messages.length + 1}` }]);

            try {
                const response = await axios.post("http://127.0.0.1:8000/run_query/", { query: userMessage });
                const aiMessage = response.data.response.result;
                console.log(response.data.response.result); 
                // console.log(response.data);
                setMessages([...messages, { role: "user", content: userMessage, id: `${messages.length + 1}` }, { role: "assistant", content: aiMessage, id: `${messages.length + 2}` }]);
            } catch (error) {
                console.error("Error fetching response: ", error);
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
                        sources={role !== "assistant" ? [] : sources}
                    />
                ))}
            </div>

            <form className="p-4 flex clear-both" onSubmit={handleFormSubmit}>
                <Input placeholder={"Type to chat with AI..."} className="mr-2" />
                <Button type="submit" className="w-24">
                    Ask
                </Button>
            </form>
        </div>
    );
}







// import { ChatBubble } from "./chat-bubble";
// import {Button} from "@/components/ui/button";

// import { Input } from "@/components/ui/input";
// import {Message} from "ai/react";

// export function Chat() {
//     const messages: Message[] = [
//         {role: "assistant", content:"Hey I am your AI", id:"1"},
//         {role: "user", content:"Hey I am the user", id:"2"},
//     ];
//     const sources = ["I am source one", "I am source two"];

//     return (
//         <div className="m-20 rounded-2xl border h-[75vh] flex flex-col justify-between">
//             <div className="p-6 overflow-auto">
//                 {messages.map(({id, role, content}: Message, index) => (
//                     <ChatBubble 
//                         key={id}
//                         role={role}
//                         content={content}
//                         sources={role !== "assistant" ? [] :sources}
//                     />
//                 ))}
//             </div>

//             <form className="p-4 flex clear-both">
//                 <Input placeholder={"Type to chat with AI..."} className="mr-2" />

//                 <Button type="submit" className="w-24">
//                     Ask
//                 </Button>
//             </form>
//         </div>
//     );
// }
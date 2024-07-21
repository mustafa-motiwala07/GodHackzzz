// import * as React from "react";
// import { cn } from "@/lib/utils";
// import Balancer from "react-wrap-balancer";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// import { Message } from "ai/react";
// import ReactMarkdown from "react-markdown";
// import { formattedSourceText } from "@/lib/utils";

// const wrappedText = (text: string) =>
//   text.split("\n").map((line, i) => (
//     <span key={i}>
//       {line}
//       <br />
//     </span>
//   ));

// interface ChatBubbleProps extends Partial<Message> {
//   sources: string[];
// }

// export function ChatBubble({
//   role = "assistant",
//   content,
//   sources,
// }: ChatBubbleProps) {
//   if (!content) {
//     return null;
//   }

//   const wrappedMessage = wrappedText(content);

//   return (
//     <div>
//       <Card className="mb-2">
//         <CardHeader>
//           <CardTitle
//             className={
//               role !== "assistant"
//                 ? "text-amber-500 dark:text-amber-200"
//                 : "text-blue-500 dark:text-blue-200"
//             }
//           >
//             {role === "assistant" ? "AI" : "You"}
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Balancer>{wrappedMessage}</Balancer>
//         </CardContent>
//         {/* <CardFooter>
//           <CardDescription className="w-full">
//             {sources && sources.length ? (
//               <Accordion type="single" collapsible className="w-full">
//                 {sources.map((source, index) => (
//                   <AccordionItem value={`source-${index}`} key={`source-${index}`}>
//                     <AccordionTrigger>{`Source ${index + 1}`}</AccordionTrigger>
//                     <AccordionContent>
//                       <ReactMarkdown>
//                         {formattedSourceText(source)}
//                       </ReactMarkdown>
//                     </AccordionContent>
//                   </AccordionItem>
//                 ))}
//               </Accordion>
//             ) : null}
//           </CardDescription>
//         </CardFooter> */}
//       </Card>
//     </div>
//   );
// }

import * as React from "react";
import Balancer from "react-wrap-balancer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThreeDots } from "react-loader-spinner";
import { Message } from "ai/react";

const wrappedText = (text: string) =>
  text.split("\n").map((line, i) => (
    <span key={i}>
      {line}
      <br />
    </span>
  ));

interface ChatBubbleProps extends Partial<Message> {
  sources: string[];
  isLoading?: boolean; // Optional loading prop
}

export function ChatBubble({
  role = "assistant",
  content,
  sources,
  isLoading = false, // Default to false
}: ChatBubbleProps) {
  return (
    <div className="mb-2">
      <Card className="mb-2">
        <CardHeader>
          <CardTitle
            className={
              role !== "assistant"
                ? "text-amber-500 dark:text-amber-200"
                : "text-blue-500 dark:text-blue-200"
            }
          >
            {role === "assistant" ? "AI" : "You"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8">
              <ThreeDots color="#4A90E2" height={10} width={50} />
            </div>
          ) : (
            <Balancer>{wrappedText(content || "")}</Balancer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


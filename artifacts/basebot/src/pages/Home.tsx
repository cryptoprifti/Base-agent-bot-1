import { useRef } from "react";
import { Hero } from "@/components/Hero";
import { Chat } from "@/components/Chat";

export function Home() {
  const chatRef = useRef<HTMLDivElement>(null);

  const scrollToChat = () => {
    chatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="flex flex-col">
      <Hero onStartChat={scrollToChat} />
      <div ref={chatRef} className="scroll-mt-20" />
      <Chat />
    </main>
  );
}

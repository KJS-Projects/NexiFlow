// src/app/chats/[chatId]/page.js
import ChatWindow from "@/components/chat-window";

export default async function ChatPage({ params }) {
  const { chatId } = await params;
  return <ChatWindow chatId={chatId} />;
}

export async function generateMetadata({ params }) {
  return {
    title: "Chat - Marketplace",
    description: "Chat with buyer/seller",
  };
}

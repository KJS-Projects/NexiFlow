// src/app/chats/page.js
import ChatList from "@/components/chat-list";

export default function ChatsPage() {
  return <ChatList />;
}

export const metadata = {
  title: "Your Chats - Marketplace",
  description: "Manage your conversations with buyers and sellers",
};

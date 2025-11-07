// app/my-items/page.js
import MyItemsClient from "@/components/MyItemsClient";

// This server component just renders the client component
export default function MyItemsPage() {
  return <MyItemsClient />;
}

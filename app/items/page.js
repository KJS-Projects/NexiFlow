import { createItem } from "./actions";
import { getAllItems } from "@/lib/queries/items";

export default async function ItemsPage() {
  const items = await getAllItems();

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-8">
      <form action={createItem} className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md border border-gray-200 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-center">Leave a Comment</h2>
        <input
          name="item"
          type="text"
          required
          placeholder="Write a comment..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Submit
        </button>
      </form>

      <div className="w-full max-w-md space-y-2">
        {items.map((c) => (
          <div key={c.id} className="bg-white p-3 rounded-lg shadow-sm border">
            {c.item}
          </div>
        ))}
      </div>
    </div>
  );
}

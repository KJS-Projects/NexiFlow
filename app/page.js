import { neon } from "@neondatabase/serverless";

export default function Page() {
  async function create(formData) {
    "use server";
    // Connect to the Neon database
    const sql = neon(`${process.env.DATABASE_URL}`);
    const comment = formData.get("comment");
    // Insert the comment from the form into the Postgres database
    await sql`INSERT INTO comments (comment) VALUES (${comment})`;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form action={create} className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Leave a Comment</h2>
        <input
          type="text"
          placeholder="Write a comment..."
          name="comment"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors duration-200">
          Submit
        </button>
      </form>
    </div>
  );
}

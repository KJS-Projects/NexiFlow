// app/api/admin/items/route.js
import { NextResponse } from "next/server";
import { getAllItems } from "@/lib/queries/items";

export async function GET() {
  try {
    const items = await getAllItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

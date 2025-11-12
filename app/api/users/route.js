// app/api/users/route.js
import { NextResponse } from "next/server";
import { createOrUpdateUser } from "@/lib/queries/users";
import { adminAuth } from "@/utils/firebase";

export async function POST(request) {
  try {
    const { firebase_uid, email, display_name } = await request.json();

    if (!firebase_uid || !email) {
      return NextResponse.json({ error: "Firebase UID and email are required" }, { status: 400 });
    }

    const user = await createOrUpdateUser({
      firebase_uid,
      email,
      display_name,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user in database:", error);
    return NextResponse.json({ error: "Failed to create user in database" }, { status: 500 });
  }
}

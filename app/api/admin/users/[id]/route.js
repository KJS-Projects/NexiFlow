// app/api/admin/users/[id]/route.js
import { NextResponse } from "next/server";
import { updateUserRole, deleteUser, getUserById } from "@/lib/queries/users";
import { adminAuth } from "@/utils/firebase";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params; // No need to await params in Next.js 13.4+
    const { role } = await request.json();

    // Validate role
    const validRoles = ["user", "moderator", "admin"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Update in PostgreSQL
    await updateUserRole(id, role);

    return NextResponse.json({ message: "User role updated successfully" });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params; // No need to await params in Next.js 13.4+

    // Get firebase_uid from query parameters
    const { searchParams } = new URL(request.url);
    const firebase_uid = searchParams.get("firebase_uid");

    if (!firebase_uid) {
      return NextResponse.json({ error: "Firebase UID is required" }, { status: 400 });
    }

    console.log(`Deleting user: PostgreSQL ID=${id}, Firebase UID=${firebase_uid}`);

    // First, get user data for logging/verification
    const user = await getUserById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    // Verify the firebase_uid matches
    if (user.firebase_uid !== firebase_uid) {
      return NextResponse.json({ error: "Firebase UID mismatch" }, { status: 400 });
    }

    // Soft delete from PostgreSQL first
    await deleteUser(id);
    console.log(`Successfully soft-deleted user from PostgreSQL: ${id}`);

    // Then delete from Firebase Auth
    await adminAuth.deleteUser(firebase_uid);
    console.log(`Successfully deleted user from Firebase: ${firebase_uid}`);

    return NextResponse.json({ message: "User deleted successfully from both systems" });
  } catch (error) {
    console.error("Error deleting user:", error);

    // Provide more specific error messages
    if (error.code === "auth/user-not-found") {
      return NextResponse.json({ error: "User not found in Firebase" }, { status: 404 });
    }

    return NextResponse.json({ error: `Failed to delete user: ${error.message}` }, { status: 500 });
  }
}

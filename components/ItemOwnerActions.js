// app/components/ItemOwnerActions.js
"use client";

import { useState, useEffect } from "react";
import { updateItemStatusAction, deleteItemAction } from "@/actions/itemsAction";
import { auth } from "@/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FiEdit, FiTrash2, FiCheck, FiX, FiAlertTriangle } from "react-icons/fi";

export default function ItemOwnerActions({ item }) {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  // Move onAuthStateChanged to useEffect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const isOwner = currentUser && currentUser.uid === item.user_id;

  const handleStatusUpdate = async (newStatus) => {
    if (!isOwner || !currentUser) return;

    setLoading(true);
    try {
      const result = await updateItemStatusAction(item.id, newStatus, currentUser.uid);
      if (result.success) {
        // Status updated successfully
        console.log(result.message);
        // Refresh the page to show updated status
        window.location.reload();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isOwner || !currentUser) return;

    setLoading(true);
    try {
      const result = await deleteItemAction(item.id, currentUser.uid);
      if (result.success) {
        router.push("/browse");
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  // Don't render if user is not the owner
  if (!isOwner) {
    return null;
  }

  return (
    <>
      {/* Owner Actions Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-teal-500">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <FiEdit className="text-teal-600 mr-2" />
          Manage Your Listing
        </h3>

        {/* Status Update Buttons */}
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">
            Current status:{" "}
            <span
              className={`font-semibold ${
                item.status === "active" ? "text-green-600" : item.status === "sold" ? "text-amber-600" : "text-gray-600"
              }`}>
              {item.status?.toUpperCase() || "ACTIVE"}
            </span>
          </p>

          <div className="flex flex-wrap gap-2">
            {item.status !== "sold" && (
              <button
                onClick={() => handleStatusUpdate("sold")}
                disabled={loading}
                className="flex items-center space-x-2 bg-amber-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-600 transition duration-300 disabled:opacity-50 text-sm">
                <FiCheck className="text-base" />
                <span>Mark as Sold</span>
              </button>
            )}

            {item.status !== "active" && (
              <button
                onClick={() => handleStatusUpdate("active")}
                disabled={loading}
                className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition duration-300 disabled:opacity-50 text-sm">
                <FiCheck className="text-base" />
                <span>Mark as Available</span>
              </button>
            )}

            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={loading}
              className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition duration-300 disabled:opacity-50 text-sm">
              <FiTrash2 className="text-base" />
              <span>Delete Item</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FiAlertTriangle className="text-red-500 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Delete Item</h3>
                <p className="text-gray-600 text-sm">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to delete "<strong>{item.title}</strong>"? This will permanently remove the item from the marketplace.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition duration-300">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition duration-300 disabled:opacity-50 flex items-center justify-center space-x-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <FiTrash2 className="text-base" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

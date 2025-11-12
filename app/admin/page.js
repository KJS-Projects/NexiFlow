// app/admin/page.js
"use client";

import { useState, useEffect } from "react";
import { auth } from "@/utils/firebaseBrowser";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";

// Mock admin users - consider moving this to environment variables
const ADMIN_USERS = ["admin@gmail.com", "your-admin-email@example.com"];

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    activeItems: 0,
    totalUsers: 0,
    activeUsers: 0,
    recentItems: 0,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });

        // Check if user is admin
        const isAdminUser = ADMIN_USERS.includes(user.email);
        setIsAdmin(isAdminUser);

        if (isAdminUser) {
          await loadAdminData();
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadAdminData = async () => {
    try {
      // Load items and users in parallel using API routes
      const [itemsResponse, usersResponse] = await Promise.all([
        fetch("/api/admin/items").then((res) => res.json()),
        fetch("/api/admin/users").then((res) => res.json()),
      ]);

      setItems(itemsResponse);
      setUsers(usersResponse);

      // Calculate stats
      const activeItems = itemsResponse.filter((item) => item.status === "active").length;
      const activeUsers = usersResponse.filter((user) => user.status === "active").length;
      const recentItems = itemsResponse.filter((item) => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return new Date(item.created_at) > oneWeekAgo;
      }).length;

      setStats({
        totalItems: itemsResponse.length,
        activeItems,
        totalUsers: usersResponse.length,
        activeUsers,
        recentItems,
      });
    } catch (error) {
      console.error("Error loading admin data:", error);
      alert("Failed to load admin data");
    }
  };

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/items/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update item status");
      }

      // Update local state
      setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, status: newStatus } : item)));

      // Reload stats
      await loadAdminData();
    } catch (error) {
      console.error("Error updating item status:", error);
      alert("Failed to update item status");
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/items/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      // Update local state
      setItems((prev) => prev.filter((item) => item.id !== itemId));

      // Reload stats
      await loadAdminData();

      alert("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item");
    }
  };

  const handleUserRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user role");
      }

      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user)));
      alert("User role updated successfully");
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Failed to update user role");
    }
  };

  // In your admin page component
  const handleDeleteUser = async (userId, firebase_uid) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This will permanently remove all their data from both the database and Firebase authentication."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}?firebase_uid=${encodeURIComponent(firebase_uid)}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete user");
      }

      setUsers((prev) => prev.filter((user) => user.id !== userId));
      await loadAdminData();
      alert("User deleted successfully from both systems");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(`Failed to delete user: ${error.message}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <AccessDenied message="Please sign in to access the admin panel." />;
  }

  if (!isAdmin) {
    return <AccessDenied message="You don't have permission to access the admin panel." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome, {user.displayName || user.email}</p>
          </div>
          <button onClick={handleSignOut} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300">
            Sign Out
          </button>
        </div>

        {/* Stats Overview */}
        <StatsOverview stats={stats} />

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} itemsCount={items.length} />

          <div className="p-6">
            {activeTab === "dashboard" && <AdminDashboard stats={stats} items={items} users={users} />}
            {activeTab === "items" && <ManageItems items={items} onStatusChange={handleStatusChange} onDeleteItem={handleDeleteItem} />}
            {activeTab === "users" && <UserManagement users={users} onRoleChange={handleUserRoleChange} onDeleteUser={handleDeleteUser} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading Spinner Component
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Access Denied Component
function AccessDenied({ message }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-2xl">🚫</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <Link href="/" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// Stats Overview Component
function StatsOverview({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard title="Total Items" value={stats.totalItems} icon="📦" color="blue" />
      <StatCard title="Active Items" value={stats.activeItems} icon="✅" color="green" />
      <StatCard title="Recent Items (7d)" value={stats.recentItems} icon="🆕" color="orange" />
      <StatCard title="Total Users" value={stats.totalUsers} icon="👥" color="purple" />
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}

// Tab Navigation Component
function TabNavigation({ activeTab, setActiveTab, itemsCount }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "items", label: `Manage Items (${itemsCount})` },
    { id: "users", label: "User Management" },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="flex -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

// Dashboard Component
function AdminDashboard({ stats, items, users }) {
  const recentItems = items.slice(0, 5);
  const recentUsers = users.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        {/* <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/items/new" className="bg-blue-500 text-white p-4 rounded-lg text-center hover:bg-blue-600 transition duration-300">
            <div className="text-lg font-semibold">Add New Item</div>
            <div className="text-sm opacity-90">Create a listing</div>
          </Link>

          {/* <button className="bg-green-500 text-white p-4 rounded-lg text-center hover:bg-green-600 transition duration-300">
            <div className="text-lg font-semibold">View Reports</div>
            <div className="text-sm opacity-90">Analytics & insights</div>
          </button>

          <button className="bg-purple-500 text-white p-4 rounded-lg text-center hover:bg-purple-600 transition duration-300">
            <div className="text-lg font-semibold">System Settings</div>
            <div className="text-sm opacity-90">Platform configuration</div>
          </button>

          <button className="bg-orange-500 text-white p-4 rounded-lg text-center hover:bg-orange-600 transition duration-300">
            <div className="text-lg font-semibold">Backup Data</div>
            <div className="text-sm opacity-90">Export database</div>
          </button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Items */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Items</h3>
          <div className="space-y-3">
            {recentItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent items</p>
            ) : (
              recentItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded border">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{item.title}</p>
                    <p className="text-sm text-gray-600">
                      ${item.price} • {item.category}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      item.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}>
                    {item.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Users</h3>
          <div className="space-y-3">
            {recentUsers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent users</p>
            ) : (
              recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-white rounded border">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{user.email}</p>
                    <p className="text-sm text-gray-600">
                      {user.role} • {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                    {user.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Manage Items Component
function ManageItems({ items, onStatusChange, onDeleteItem }) {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = items.filter((item) => {
    const matchesFilter = filter === "all" || item.status === filter;
    const matchesSearch = item.title?.includes(searchTerm) || item.category?.includes(searchTerm) || item.user_email?.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const statusStyles = {
      active: "bg-green-100 text-green-800",
      sold: "bg-blue-100 text-blue-800",
    };

    return <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status] || "bg-gray-100"}`}>{status}</span>;
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <h2 className="text-xl font-semibold text-gray-800">Manage Items</h2>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No items found matching your criteria.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {item.image_urls && item.image_urls.length > 0 ? (
                          <img className="h-10 w-10 rounded object-cover" src={item.image_urls[0]} alt={item.title} />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{item.title}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${item.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.user_name}</div>
                    <div className="text-sm text-gray-500">{item.user_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link href={`/items/${item.id}`} className="text-blue-600 hover:text-blue-900">
                      View
                    </Link>
                    <select
                      value={item.status}
                      onChange={(e) => onStatusChange(item.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1">
                      <option value="active">Active</option>
                      <option value="sold">Sold</option>
                    </select>
                    <button onClick={() => onDeleteItem(item.id)} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Enhanced User Management Component
function UserManagement({ users, onRoleChange, onDeleteUser }) {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter((user) => {
    const matchesFilter = filter === "all" || user.role === filter;
    const matchesSearch = user.email?.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const getRoleBadge = (role) => {
    const roleStyles = {
      admin: "bg-purple-100 text-purple-800",
      user: "bg-blue-100 text-blue-800",
      moderator: "bg-green-100 text-green-800",
    };

    return <span className={`px-2 py-1 text-xs rounded-full ${roleStyles[role] || "bg-gray-100"}`}>{role}</span>;
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
        {status}
      </span>
    );
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <h2 className="text-xl font-semibold text-gray-800">User Management</h2>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
          </select>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No users found matching your criteria.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-400 text-sm">{user.email ? user.email[0].toUpperCase() : "U"}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.email}</div>
                        <div className="text-sm text-gray-500">ID: {user.firebase_uid}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(user.role)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {/* <select
                      value={user.role}
                      onChange={(e) => onRoleChange(user.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1">
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select> */}
                    <button onClick={() => onDeleteUser(user.id, user.firebase_uid)} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

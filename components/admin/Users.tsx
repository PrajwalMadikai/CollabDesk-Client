"use client";
import { ADMIN_API } from "@/api/handle-token-expire";
import usersInterface from "@/interfaces/adminUsers";
import axios from "axios";
import { Search, Users as UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Users = () => {
  
  const [users, setUsers] = useState<usersInterface[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
 const token=localStorage.getItem('adminAccessToken')
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("adminAccessToken");
        if (!token) {
          throw new Error("No access token found");
        }
    
        const response = await ADMIN_API.get("/users");
        setUsers(response.data.users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          // Let the interceptor handle the refresh
          setUsers([]);
        } else {
          setUsers([]);
          toast.error("Failed to fetch users");
        }
      }
    };

    fetchUsers();
  }, []);

  const filterUser=users.filter(user=>
    user.email.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
  )

  return (
    <div className=" md:w-[1250px] min-h-screen  bg-black text-white p-4 sm:p-6 md:p-8 border-gray-400 rounded-[5px] px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <UsersIcon className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Users Management</h1>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={e=>setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 text-white placeholder-gray-400"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {/* Total Users Card */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h3 className="text-gray-400 text-sm font-medium">Total Users</h3>
            <p className="text-2xl font-bold mt-2">{filterUser.length}</p>
          </div>

          {/* Active Users Card */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h3 className="text-gray-400 text-sm font-medium">Active Users</h3>
            <p className="text-2xl font-bold mt-2">
            </p>
          </div>

          {/* Admin Users Card */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:col-span-2 md:col-span-1">
            <h3 className="text-gray-400 text-sm font-medium">Admin Users</h3>
            <p className="text-2xl font-bold mt-2">
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="w-full overflow-x-auto rounded-lg border border-gray-700">
        <table className="w-full text-left">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold hidden sm:table-cell">Profile</th>
              <th className="px-6 py-3 text-sm font-semibold hidden sm:table-cell">Email</th>
              <th className="px-6 py-3 text-sm font-semibold hidden sm:table-cell">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filterUser.length > 0 ? (
              filterUser.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800 transition-colors">
                  {/* Profile Placeholder */}
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 hidden sm:table-cell">{user.email}</td>

                  {/* Status */}
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isBlock ? "bg-red-500 text-white" : "bg-green-500 text-white"
                      }`}
                    >
                      {user.isBlock ? "Blocked" : "Active"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-6 py-4 text-center text-gray-500" colSpan={3}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        </div>
      </div>
    </div>
  );
};

export default Users;
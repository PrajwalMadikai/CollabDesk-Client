"use client";
import { ADMIN_API } from "@/api/handle-token-expire";
import usersInterface from "@/interfaces/adminUsers";
import { Search, Users as UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";

const Users = () => {
  
  const [users, setUsers] = useState<usersInterface[]>([]);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await ADMIN_API.get("http://localhost:5713/admin/users");  
        console.log("API Response:", response.data.users); 
        setUsers(response.data.users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);
  console.log('users[]:',users);
  

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
            <p className="text-2xl font-bold mt-2">{users.length}</p>
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
                <th className="px-6 py-3 text-sm font-semibold hidden sm:table-cell">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {Array.isArray(users) && users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800 transition-colors">
                  
                  <td className="px-6 py-4 hidden sm:table-cell">{user.email}</td>
                  {/* <td className="px-6 py-4 hidden sm:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === "Active" 
                        ? "bg-green-500/20 text-green-500" 
                        : "bg-red-500/20 text-red-500"
                    }`}>
                      {user.status}
                    </span>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
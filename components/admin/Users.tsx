"use client";
import { Search, Users as UsersIcon } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../../components/ui/pagination";
import { useUsersManagement } from "../../hooks/useUserManagementhook";

const Users = () => {
 
  const {  
    paginatedUsers,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    blockUser,
    unblockUser,
    filterUsers
  }=useUsersManagement()
  return (
    <div className="md:w-[1250px] min-h-screen bg-black text-white p-4 sm:p-6 md:p-8 border-gray-400 rounded-[5px] px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <UsersIcon className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Users Management</h1>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 text-white placeholder-gray-400"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h3 className="text-gray-400 text-sm font-medium">Total Users</h3>
            <p className="text-2xl font-bold mt-2">{filterUsers.length}</p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h3 className="text-gray-400 text-sm font-medium">Active Users</h3>
            <p className="text-2xl font-bold mt-2">
              {filterUsers.filter((user) => !user.isBlock).length}
            </p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:col-span-2 md:col-span-1">
            <h3 className="text-gray-400 text-sm font-medium">Blocked Users</h3>
            <p className="text-2xl font-bold mt-2">
            {filterUsers.filter((user) => user.isBlock).length}
            </p>
          </div>
        </div>

        <div className="w-full overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full text-left">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold hidden sm:table-cell">Profile</th>
                <th className="px-6 py-3 text-sm font-semibold hidden sm:table-cell">Email</th>
                <th className="px-6 py-3 text-sm font-semibold hidden sm:table-cell">Status</th>
                <th className="px-6 py-3 text-sm font-semibold hidden sm:table-cell"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    </td>

                    <td className="px-6 py-4 hidden sm:table-cell">{user.email}</td>

                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.isBlock ? "bg-red-500 text-white" : "bg-green-500 text-white"
                        }`}
                      >
                        {user.isBlock ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.isBlock ? (
                        <button
                          onClick={() => unblockUser(user.id)}
                          className="border bg-blue-800 text-white px-4 py-1 rounded-[2px] hover:bg-gray-700 transition-colors"
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => blockUser(user.id)}
                          className="border bg-blue-800 text-white px-[25px] py-1 rounded-md hover:bg-gray-700 transition-colors"
                        >
                          Block
                        </button>
                      )}
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

        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {[...Array(totalPages).keys()].map((page) => (
                <PaginationItem key={page + 1}>
                  <PaginationLink
                    isActive={currentPage === page + 1}
                    onClick={() => setCurrentPage(page + 1)}
                  >
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default Users;
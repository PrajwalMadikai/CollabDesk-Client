import { ADMIN_API } from "@/app/api/handle-token-expire";
import { baseUrl } from '@/app/api/urlconfig';
import { ResponseStatus } from "@/enums/responseStatus";
import getResponseStatus from "@/lib/responseStatus";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useUsersManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminAccessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await ADMIN_API.get(`/users`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
        },
      });

      const responseStatus = getResponseStatus(response.status);

      if (responseStatus === ResponseStatus.SUCCESS) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setUsers([]);
      } else {
        setUsers([]);
        toast.error("Failed to fetch users");
      }
    }
  };

  const blockUser = async (userId: string) => {
    try {
      const response = await ADMIN_API.post(`${baseUrl}/admin/block`, { userId });
      const responseStatus = getResponseStatus(response.status);

      if (responseStatus === ResponseStatus.SUCCESS) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, isBlock: true } : user
          )
        );
        toast.success("User blocked successfully", {
          duration: 2000,
          position: "top-right",
        });
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const unblockUser = async (userId: string) => {
    try {
      const response = await ADMIN_API.post(`${baseUrl}/admin/unblock`, { userId });
      const responseStatus = getResponseStatus(response.status);

      if (responseStatus === ResponseStatus.SUCCESS) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, isBlock: false } : user
          )
        );
        toast.success("User unblocked successfully", {
          duration: 2000,
          position: "top-right",
        });
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const filterUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filterUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filterUsers.slice(startIndex, endIndex);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, itemsPerPage]);

  return {
    paginatedUsers,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    blockUser,
    unblockUser,
    fetchUsers,
    filterUsers,
  };
};
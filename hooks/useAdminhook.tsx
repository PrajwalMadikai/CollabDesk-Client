import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { ResponseStatus } from "../enums/responseStatus";
import getResponseStatus from "../lib/responseStatus";
import { adminLogoutFunc } from "../services/adminApi";
import { clearAdmin, setAdmin } from "../store/slice/adminSlice";
import { AppDispatch, RootState } from "../store/store";

export const useAdminSidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const admin = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    const adminData = localStorage.getItem("admin");
    if (adminData) {
      const data = JSON.parse(adminData);
      dispatch(setAdmin({ id: data.id, email: data.email }));
    }
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      
      const response = await adminLogoutFunc()

      const responseStatus=getResponseStatus(response.status)
      if (responseStatus === ResponseStatus.SUCCESS) {
        toast.success("Logout successful!", {
          duration: 2000,
          position: "top-right",
          style: { background: "#28a745", color: "#fff" },
        });

        localStorage.removeItem("admin");
        localStorage.removeItem("adminAccessToken");
        dispatch(clearAdmin());
        router.replace("/admin/login");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error during logout", {
        duration: 2000,
        position: "top-right",
      });
    }
  };

  return { admin, handleLogout };
};
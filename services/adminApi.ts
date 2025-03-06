import { baseUrl } from "@/app/api/urlconfig";
import axios from "axios";

export const adminLogoutFunc=async()=>{
    try {
        const response = await axios.post(
            `${baseUrl}/admin/logout`,
            { withCredentials: true }
          );
        return response
    } catch (error) {
        throw error
    }
}
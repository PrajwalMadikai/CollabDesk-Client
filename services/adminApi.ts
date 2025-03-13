import axios from "axios";
import { baseUrl } from "../app/api/urlconfig";

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
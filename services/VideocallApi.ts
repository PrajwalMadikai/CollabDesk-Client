import axios from "axios";

export const TokenGenerate=async(workspaceId:string,userName:string|null,userId:string|null)=>{
    try {
        const response = await axios.get(`/api/video-token?room=${workspaceId}&username=${userName}`);
        
          if (response.data && response.data.token) {
            return response.data; 
          } else {
            throw new Error("Invalid response format");
          }
        } catch (error:any) {
          throw error
      }
}

 
import { API } from "@/app/api/handle-token-expire"

export const workspaceCreateFunc=async(spaceName:string,userId:string)=>{
    try {

        const response=await API.post('/workspace/create',{spaceName,userId},{ withCredentials: true })

        return response 
        
    } catch (error:any) {
        return error.response.data
    }
}

export const workspaceFetch=async(userId:string)=>{
    try {
         const response=await API.post('/workspace/fetch',{userId},{withCredentials:true})
         return response
    } catch (error:any) {
        return error.response.data
    }
}

export const deleteWorkspaceFunc=async(workspaceId:string)=>{
    try {
        const response=await API.post('/workspace/delete', 
            { workspaceId },
            { withCredentials: true }
          );
          
          return response
        
    } catch (error:any) {
        return error.response.data
    }
}
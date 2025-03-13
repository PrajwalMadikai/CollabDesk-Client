import { API } from "../app/api/handle-token-expire"

export const workspaceCreateFunc=async(spaceName:string,userId:string)=>{
    try {

        const response=await API.post('/workspace/create',{spaceName,userId},{ withCredentials: true })

        return response 
        
    } catch (error:any) {
        throw error
    }
}

export const workspaceFetch=async(userId:string)=>{
    try {
         const response=await API.post('/workspace/fetch',{userId},{withCredentials:true})
         return response
        } catch (error) {
            throw error
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
            throw error
        }
}

export const fetchCollaboratorsFunc=async(workspaceId:string)=>{
    try {
        const response=await API.post(
            "/workspace/collaborators",
            { workspaceId },
            { withCredentials: true }
          );
          
          return response
        
        } catch (error:any) {
            throw error
        }
}

export const collaboratorsAddFunct=async(email:string,workspaceId:string,invitedEmail:string|null)=>{
    try {
        const response=await  API.post(
            "/workspace/add-collaborator",
            { email, workspaceId, invitedEmail },
            { withCredentials: true }
          );
          
          return response
        
        } catch (error:any) {
            throw error
        }
}

export const removeCollaboratorsFunc=async(email:string,workspaceId:string)=>{
    try {
        const response = await API.post(
            "/workspace/remove-collaborator",
            { email, workspaceId },
            { withCredentials: true }
          );
          
          return response
        
        } catch (error:any) {
            throw error
        }
}


export const renameWorkspaceFunct=async(workspaceId:string,newName:string)=>{
    try {
        const response = await API.post(
            "/workspace/rename",
            { workspaceId, newName },
            { withCredentials: true }
          );
          
          return response
        
        } catch (error:any) {
            throw error
        }
}

export const userActivityLogs=async(workspaceId:string)=>{
    try {
        
        const response = await API.post(
            "/workspace/user-logs",
            { workspaceId },
            { withCredentials: true }
          );
          
          return response
        
        } catch (error:any) {
            throw error
        }
}
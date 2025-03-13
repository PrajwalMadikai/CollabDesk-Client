import { API } from "../app/api/handle-token-expire";

export const folderFetchFunc=async(workspaceId:string)=>{
    try {
        const response=await API.post("/folder/fetch", { workspaceId }, { withCredentials: true });
        return response
    } catch (error:any) {
        throw error
    }
}

export const folderTrashFetchFun=async(workspaceId:string)=>{
    try {
        const response = await API.post(
            "/folder/trash-fetch",
            { workspaceId },
            { withCredentials: true }
          );
        return response
        
    } catch (error:any) {
        throw error
    }
}
export const folderCreateFunc=async(workspaceId:string,userId:string)=>{
    try {
        const response = await API.post('/folder/create',{ name: "Untitled",workspaceId,userId},{ withCredentials: true })
        return response
        
    } catch (error:any) {
        throw error
    }
}

export const folderUpdateFunc=async(folderId:string,editingFolderName:string,email:string|null)=>{
    try {
        const response= await API.put(`/folder/update/${folderId}`, {
            name: editingFolderName,email
          }, { withCredentials: true });

        return response

    } catch (error:any) {
        throw error
    }
}

export const folderMovetoTrash=async(folderId:string, workspaceId : string,email:string)=>{
    try {
        const response = await API.post(
            '/folder/move-to-trash',
            { folderId, workspaceId,email },
            { withCredentials: true }
          );

        return response
        
    } catch (error:any) {
        throw error
    }
}

export const folderRestoreFunc=async(folderId:string,email:string|null)=>{
    try {
        const response =  await API.post(
            '/folder/restore',
            { folderId ,email},
            { withCredentials: true })

        return response
           
    } catch (error:any) {
        throw error
    }
}
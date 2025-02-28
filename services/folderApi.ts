import { API } from "@/app/api/handle-token-expire";

export const folderFetchFunc=async(workspaceId:string)=>{
    try {
        const response=await API.post("/folder/fetch", { workspaceId }, { withCredentials: true });
        return response
    } catch (error:any) {
        return error.response.data
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
        return error.response.data
    }
}
export const folderCreateFunc=async(workspaceId:string,userId:string)=>{
    try {
        const response = await API.post('/folder/create',{ name: "Untitled",workspaceId,userId},{ withCredentials: true })
        return response
        
    } catch (error:any) {
        return error.response.data
    }
}

export const folderUpdateFunc=async(folderId:string,editingFolderName:string)=>{
    try {
        const response= await API.put(`/folder/update/${folderId}`, {
            name: editingFolderName
          }, { withCredentials: true });

        return response

    } catch (error:any) {
        return error.response.data
    }
}

export const folderMovetoTrash=async(folderId:string, workspaceId : string)=>{
    try {
        const response = await API.post(
            '/folder/move-to-trash',
            { folderId, workspaceId },
            { withCredentials: true }
          );

        return response
        
    } catch (error:any) {
        return error.response.data
    }
}

export const folderRestoreFunc=async(folderId:string)=>{
    try {
        const response =  await API.post(
            '/folder/restore',
            { folderId },
            { withCredentials: true })

        return response
           
    } catch (error:any) {
        return error.response.data
    }
}
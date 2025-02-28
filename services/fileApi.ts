import { API } from "@/app/api/handle-token-expire";

export const fileCreateFunc=async(folderId:string)=>{
    try {
        const response = await API.post("/file/create", { 
            folderId 
          }, { withCredentials: true });

        return response

    } catch (error:any) {
        return error.response.data
    }
}

export const renameFileFunc=async(fileId:string,editingFileName:string,folderId:string)=>{
    try {
        const response = await API.put(`/file/update/${fileId}`, {
            name: editingFileName,
            folderId
          }, { withCredentials: true });
        return response
        
    } catch (error:any) {
        return error.response.data
    }
}

export const moveFileToTrashFunc=async(fileId:string,folderId :string)=>{
    try {
        const response = await API.post(
            `/file/move-to-trash`,
            { fileId, folderId },
            { withCredentials: true }
          );
        return response  
        
    } catch (error:any) {
        return error.response.data
    }
}

export const fileRestoreFunc=async(fileId:string)=>{
    try {
        const response = await API.post(
            '/file/restore',
            { fileId },
            { withCredentials: true }
          );
        return response  
        
    } catch (error:any) {
        return error.response.data
    }
}
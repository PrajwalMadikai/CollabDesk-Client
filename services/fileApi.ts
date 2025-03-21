import axios from "axios";
import { API } from "../app/api/handle-token-expire";
import { baseUrl } from "../app/api/urlconfig";

export const fileCreateFunc = async (folderId: string, email: string | null) => {
  try {
    const response = await API.post("/file/create", {
      folderId, email
    }, { withCredentials: true });

    return response

  } catch (error) {
    throw error
  }
}

export const renameFileFunc = async (fileId: string, editingFileName: string, folderId: string, email: string | null) => {
  try {
    const response = await API.put(`/file/update/${fileId}`, {
      name: editingFileName,
      folderId,
      email
    }, { withCredentials: true });
    return response

  } catch (error: any) {
    throw error
  }
}

export const moveFileToTrashFunc = async (fileId: string, folderId: string, email: string | null) => {
  try {
    const response = await API.post(
      `/file/move-to-trash`,
      { fileId, folderId, email },
      { withCredentials: true }
    );
    return response

  } catch (error: any) {
    throw error
  }
}

export const fileRestoreFunc = async (fileId: string, email: string | null) => {
  try {
    const response = await API.post(
      '/file/restore',
      { fileId, email },
      { withCredentials: true }
    );
    return response

  } catch (error: any) {
    throw error
  }
}

export const makeDocPublish = async (fileId: string) => {
  try {
    const response = await API.post(`/file/publish/${fileId}`, { withCredentials: true })
    return response
  } catch (error: any) {
    throw error
  }
}

export const fileReviewFunc = async (fileId: string) => {
  try {

    const response = await axios.get(`${baseUrl}/file/preview/${fileId}`)

    return response

  } catch (error: any) {
    throw error
  }
}
export const grantRoomAccess = async (roomId: string) => {
  try {
    const response = await fetch("/api/preview-room-access", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomId }),
    });

    if (!response.ok) {
      throw new Error("Failed to grant room access");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};


export const FileData = async (fileId: string) => {
  try {
    const response = await API.get(`/file/${fileId}`, { withCredentials: true });

    return response

  } catch (error) {
    throw error;
  }
}

export const imageUpload = async (fileId: string, formData: FormData) => {
  try {
    const response = await API.put(`/file/uploadImage/${fileId}`, formData, {
      withCredentials: true,
    });

    return response

  } catch (error) {
    throw error;
  }
}
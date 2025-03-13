import axios from "axios";
import { API } from "../app/api/handle-token-expire";
import { baseUrl } from "../app/api/urlconfig";


export const loginEmail=async(email:string,password:string)=>{
    try {
        const response=await API.post('/login', { email, password },{ withCredentials: true });
        
        return response
        
    } catch (error:any) {
        throw error
    }
}

export const googleLogin=async(idToken:string)=>{
    try {
        const response=await API.post('/google-login',{ idToken },{ withCredentials: true });
      
        return response
    } catch (error:any) {
        throw error
    }
}

export const signupEmail=async(fullName:string,email:string,password:string)=>
{
    try {

        const response =  await axios.post(`${baseUrl}/signup`, {
            fullName,
            email,
            password,
            isAdmin:false
          },{ withCredentials: true });

        return response
        
    } catch (error:any) {
        throw error
    }
}

export const googleSignUp=async(idToken:string)=>{
    try {

        const response=await axios.post(`${baseUrl}/google-signup`,{idToken},{ withCredentials: true })

        return response
        
    } catch (error:any) {
        throw error
    }
}

export const resetPasswordFunc=async(email:string,password:string)=>{
    try {

        const response=await axios.post(`${baseUrl}/reset-password`,{email,password})

        return response
        
    } catch (error:any) {
        throw error
    }
}

export const fetchAllusersFunc=async()=>{
    try {
        const response = await API.get("/fetch-user", { withCredentials: true });
        return response
        
    } catch (error:any) {
        throw error
    }
}

export const renameUserFunc=async(userId:string|null,newName:string)=>{
    try {
        const response = await API.put(
            "/update-name",
            { userId, newName },
            { withCredentials: true }
          );
        return response
        
    } catch (error:any) {
        throw error
    }
}

export const userData=async(userId:string)=>{
    try {
        const response =  await axios.get(`${baseUrl}/user/${userId}`)
        return response
        
    } catch (error:any) {
        throw error
    }
}

export const profileUpload=async(formData:FormData,userId:string|null)=>{
    try {
        if (userId) {
            formData.append('userId', userId);
          }

        const response = await API.post('/profile-upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true,
          });

        return response
        
    } catch (error) {
        throw error
    }
}
export const ChangePassword=async(userId:string|null,password:string)=>
{
    try {
        const response = await API.put('/change-password',{userId,password},{withCredentials:true})
        return response
    } catch (error) {
        throw error
    }
}
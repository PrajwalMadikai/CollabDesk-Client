import { API } from "@/app/api/handle-token-expire";
import { baseUrl } from "@/app/api/urlconfig";
import axios from "axios";


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


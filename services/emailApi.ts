import { baseUrl } from "@/app/api/urlconfig"
import axios from "axios"

export const emailVerify=async(email:string,token:string)=>{
    try {

        const response = await axios.post(`${baseUrl}/verify-email`, { email, token })

        return response
        
    } catch (error:any) {
        return error.response.data
    }
}

export const sendVerificationEmailAPI=async(email:string)=>{
    try {
        const response=await axios.post(`${baseUrl}/send-mail`, { email })

        return response
        
    } catch (error:any) {
        return error.response.data
    }
}

export const emailCheck=async(email:string,token:string)=>{
    try {

        const response=await axios.post(`${baseUrl}/email-check`, {
            email,
            token
          });

        return response
        
    } catch (error:any) {
        return error.response.data
    }
}
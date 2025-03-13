import axios from "axios"
import { baseUrl } from "../app/api/urlconfig"

export const emailVerify=async(email:string,token:string)=>{
    try {

        const response = await axios.post(`${baseUrl}/verify-email`, { email, token })

        return response
        
    } catch (error:any) {
       throw error
    }
}

export const sendVerificationEmailAPI=async(email:string)=>{
    try {
        const response=await axios.post(`${baseUrl}/send-mail`, { email })

        return response
        
    } catch (error:any) {
       throw error
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
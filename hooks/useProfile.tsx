import { ResponseStatus } from "@/enums/responseStatus";
import getResponseStatus from "@/lib/responseStatus";
import { profileUpload, userData } from "@/services/AuthApi";
import { useState } from "react";
import toast from "react-hot-toast";

interface userData1{
    email:string,
    password:string,
    paymentPlan:string,
    expireDate:Date,
    avatar:string,
}

export const useProfile=()=>{

    const [userProfile,setuserProfile]=useState<userData1>()
 
    const fetchUserDetils=async(userId:string)=>{
      try {
        const response = await userData(userId)
        const responseStatus=getResponseStatus(response.status)
        console.log('suer:',response.data.user);
        
        if(responseStatus==ResponseStatus.SUCCESS)
        {
            setuserProfile({
                email:response.data.user.email,
                password:response.data.user.password,
                paymentPlan:response.data.user.paymentDetail.paymentType,
                expireDate:response.data.user.paymentDetail.endDate,
                avatar:response.data.user.avatar,
            })
        }
      } catch (error) {
        console.log('error in fetching user info',error);
        
      }
    }

    const handleImageUpload=async(e:React.ChangeEvent<HTMLInputElement>,userId:string|null)=>{
      const file = e.target.files?.[0]
      if (!file) {
        console.error("No file selected");
        return;
      }
      try {
        const formData=new FormData()
        formData.append('profileImage',file)

        const response = await profileUpload(formData,userId)

        const responseStatus=getResponseStatus(response.status)
        if(responseStatus==ResponseStatus.SUCCESS){

          setuserProfile((prevProfile) => {
            const updatedProfile: userData1 = {
              avatar: response.data.user.avatar,  
              email: prevProfile?.email || "",  
              password: prevProfile?.password || "",
              paymentPlan: prevProfile?.paymentPlan || "",
              expireDate: prevProfile?.expireDate || new Date(),  
            };
    
            return updatedProfile;  
          });
      }
      } catch (error) {
        console.log('error:',error);
        
        toast.error('Unable to upload profile',{
          position:'top-right'
        })
      }
    }
    return {
        fetchUserDetils,
        userProfile,
        handleImageUpload
    }

}
 
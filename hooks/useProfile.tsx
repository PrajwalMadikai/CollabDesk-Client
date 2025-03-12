import { ResponseStatus } from "@/enums/responseStatus";
import getResponseStatus from "@/lib/responseStatus";
import { ChangePassword, profileUpload, userData } from "@/services/AuthApi";
import { updateAvatar } from "@/store/slice/userSlice";
import passwordChangeSchema from "@/validations/passwordChange";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

interface userData1{
    email:string,
    password:string,
    paymentPlan:string,
    expireDate:Date,
    avatar:string,
}

export const useProfile=()=>{

    const [userProfile,setuserProfile]=useState<userData1>()
    const [newPassword, setNewPassword] = useState('');
    const [error,setError]=useState<string | null>(null);
    const dispatch=useDispatch()

    const fetchUserDetils=async(userId:string)=>{
      try {
        const response = await userData(userId)
        const responseStatus=getResponseStatus(response.status)
        
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
          toast.success('Profile image updated!',{
            duration:2000,
            position:'top-right',
            style: {
              background: '#166534',  
              color: '#d1fae5',    
              borderRadius: '8px',    
              padding: '12px',        
              fontSize: '14px',      
            },
          });
          
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
          dispatch(updateAvatar(response.data.user.avatar))
      }
      } catch (error) {
        console.log('error:',error);
        
        toast.error('Unable to upload profile',{
          position:'top-right'
        })
      }
    }
     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
        setError(null);  
      };
      const handleSubmit = async (userId:string|null) => {
    
        try {
          await passwordChangeSchema.parseAsync({ newPassword });
          const response = await ChangePassword(userId,newPassword)
          const responseStatus=getResponseStatus(response.status)
          if(responseStatus==ResponseStatus.SUCCESS)
          {
            toast.success('Password updated!', {
              duration: 2000,
              position: 'top-right',
              style: {
                background: '#166534', 
                color: '#d1fae5',     
                borderRadius: '8px',    
                padding: '12px',        
                fontSize: '14px',      
                width: '300px',      
                maxWidth: '90vw',      
              },
            });
          }
         
        } catch (err: any) {
          if (err.errors && err.errors.length > 0) {
            setError(err.errors[0].message);  
          } else {
            setError('An unexpected error occurred.');
          }
        }
      };
    
    return {
        fetchUserDetils,
        userProfile,
        handleImageUpload,
        handleChange,
        handleSubmit,
        error,
        newPassword
    }

}

function setNewPassword(value: string) {
  throw new Error("Function not implemented.");
}

function setError(arg0: null) {
  throw new Error("Function not implemented.");
}
 
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { ResponseStatus } from "../enums/responseStatus";
import getResponseStatus from "../lib/responseStatus";
import { ChangePassword, profileUpload, userData } from "../services/AuthApi";
import { updateAvatar } from "../store/slice/userSlice";
import passwordChangeSchema from "../validations/passwordChange";

interface userData1 {
  email: string;
  password: string;
  paymentPlan: string;
  expireDate: Date;
  avatar: string;
}

export const useProfile = () => {
  const [userProfile, setUserProfile] = useState<userData1>();
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");  
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await userData(userId);
      const responseStatus = getResponseStatus(response.status);

      if (responseStatus === ResponseStatus.SUCCESS) {
        setUserProfile({
          email: response.data.user.email,
          password: response.data.user.password,
          paymentPlan: response.data.user.paymentDetail.paymentType,
          expireDate: response.data.user.paymentDetail.endDate,
          avatar: response.data.user.avatar,
        });
      }
    } catch (error) {
      console.error("Error in fetching user info", error);
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    userId: string | null
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.error("No file selected");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await profileUpload(formData, userId);
      const responseStatus = getResponseStatus(response.status);

      if (responseStatus === ResponseStatus.SUCCESS) {
        toast.success("Profile image updated!", {
          duration: 2000,
          position: "top-right",
          style: {
            background: "#166534",
            color: "#d1fae5",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "14px",
          },
        });

        setUserProfile((prevProfile) => ({
          ...prevProfile!,
          avatar: response.data.user.avatar,
        }));

        dispatch(updateAvatar(response.data.user.avatar));
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Unable to upload profile", {
        position: "top-right",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setError(null);
  };

  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
    setError(null);
  };

  const handleSubmit = async (userId: string | null) => {
    if (!currentPassword) {
      setError("Current password is required.");
      return;
    }

    try {
      await passwordChangeSchema.parseAsync({ newPassword });
      const response = await ChangePassword(userId, newPassword, currentPassword);  
      const responseStatus = getResponseStatus(response.status);

      if (responseStatus === ResponseStatus.SUCCESS){
        toast.success("Password updated!", {
          duration: 2000,
          position: "top-right",
          style: {
            background: "#166534",
            color: "#d1fae5",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "14px",
            width: "300px",
            maxWidth: "90vw",
          },
        });

        setNewPassword("");
        setCurrentPassword("");
      }
    } catch (err: any) {
      if(err.response){
      const { status, data } = err.response;
      
      if(status==404&&data?.message=='Incorrect Password!')
        {
          toast.error("Incorrect password!",{
            duration:2500,
            position:'top-right'
          })
          return
        }
      
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message);
      } else if(data?.message!="Incorrect Password!") {
        setError("An unexpected error occurred.");
      }
    }
    }
  };

  return {
    fetchUserDetails,
    userProfile,
    handleImageUpload,
    handleChange,
    handleCurrentPasswordChange,
    handleSubmit,
    error,
    newPassword,
    currentPassword,
  };
};
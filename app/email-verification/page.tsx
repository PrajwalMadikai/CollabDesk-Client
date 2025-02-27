'use client';
import { baseUrl } from "@/app/api/urlconfig";
import { ResponseStatus } from "@/enums/responseStatus";
import getResponseStatus from "@/lib/responseStatus";
import { emailSchema } from "@/validations/all validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, CircularProgress, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const EmailCheckForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);  

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(emailSchema),
  });


  const emailSubmit = async () => {
    setLoading(true);
    setEmailSent(false); 

    try {
      const response = await axios.post(`${baseUrl}/send-mail`, { email }, );

      const responseStatus = getResponseStatus(response.status)
      if (responseStatus === ResponseStatus.SUCCESS) {
        setEmailSent(true);  
        toast.success("Verification email has been sent", {
          duration: 2000,
          position: 'top-right',
          style: { background: '#4caf50', color: '#fff' },
        });
      }
    } catch (err) {
      toast.error("Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(100%_50%_at_50%_0%,rgba(98,51,238,1)_0,rgba(0,0,0,0.8)_50%,rgba(0,0,0,1)_100%)] flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row items-stretch gap-8 max-w-5xl w-full flex-grow">
        {/* Left Section: Image (Hidden on small screens) */}
        <div className="hidden md:flex flex-1 flex-col items-center text-center space-y-28 p-14 rounded-lg">
          <img
            src="/3682888-Photoroom.png"
            alt="Email Verification"
            className="w-full max-w-xs md:max-w-sm mx-auto"
          />
        </div>

        {/* Right Section: Form */}
        <div className="flex flex-1 flex-col md:mt-[110px] space-y-6 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white text-center md:text-left">
            Enter Your Email
          </h2>

          <form onSubmit={handleSubmit(emailSubmit)} className="space-y-4">
            {/* Email Input */}
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              {...register("email")}
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email && <span className="text-red-600">{errors.email.message?.toString()}</span>}
              InputProps={{
                style: {
                  backgroundColor: "transparent",
                  color: "white",
                },
              }}
              InputLabelProps={{
                style: { color: "white", fontWeight: 100, fontSize: "0.85rem" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "gray",
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "darkgray",
                    borderWidth: "1px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "gray",
                    borderWidth: "1px",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "white",
                },
                "& .MuiFormHelperText-root": {
                  color: "white",
                },
              }}
            />

            {emailSent ? (
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#008000",  
                  "&:hover": { backgroundColor: "#006400" },
                  height: "48px",
                }}
                onClick={() => window.open("https://mail.google.com",)} // Open email client
              >
                Open Email
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#1a1744",
                  "&:hover": { backgroundColor: "#15123a" },
                  height: "48px",
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Submit"}
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailCheckForm;

"use client";

import { store } from "@/store/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";

export default function AppProviders({ children }: { children: React.ReactNode }) {

    if(!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
    {
        console.log("No Google Client Id");
        return null
    }

  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        {children}
      </GoogleOAuthProvider>
      <Toaster />
    </Provider>
  );
}

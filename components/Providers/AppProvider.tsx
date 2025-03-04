"use client";
import { useAuthInit } from "@/hooks/useAuthInit";
import { store } from "@/store/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  useAuthInit();
  return <>{children}</>;
}

export default function AppProviders({ children }: { children: React.ReactNode }) {

    if(!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
    {
        console.log("No Google Client Id");
        return null
    }

  return (
    <Provider store={store}>
      <AuthInitializer>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        {children}
      </GoogleOAuthProvider>
      <Toaster />
      </AuthInitializer>
    </Provider>
  );
}

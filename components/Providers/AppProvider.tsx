"use client";

import { useAuthInit } from "@/hooks/useAuthInit";
import { persistor, store } from "@/store/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";

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
      <PersistGate loading={null} persistor={persistor}>
      <AuthInitializer>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        {children}
      </GoogleOAuthProvider>
      <Toaster />
      </AuthInitializer>
      </PersistGate>
    </Provider>
  );
}

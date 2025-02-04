"use client";

import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './slice/adminSlice';
import userReducer from './slice/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    admin:adminReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: true,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

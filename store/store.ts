"use client";
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import adminReducer from './slice/adminSlice';
import planReducer from './slice/planSlice';
import userReducer from './slice/userSlice';

const rootReducer = combineReducers({
  user: userReducer,
  admin: adminReducer,
  plan: planReducer,
});

// Configure the store without persistence
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['register.step', 'some.other.path'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
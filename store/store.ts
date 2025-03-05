"use client";
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import adminReducer from './slice/adminSlice';
import planReducer from './slice/planSlice';
import userReducer from './slice/userSlice';

const persistConfig = {
  key: 'root',  
  storage,     
};

const rootReducer = combineReducers({
  user: userReducer,
  admin: adminReducer,
  plan: planReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],  
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
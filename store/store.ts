"use client";
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import storage from 'redux-persist/lib/storage';
import adminReducer from './slice/adminSlice';
import planReducer from './slice/planSlice';
import userReducer from './slice/userSlice';

const persistConfig = {
  key: 'root', 
  storage, 
  whitelist: ['user', 'admin', 'plan'], 
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
      serializableCheck: false,  
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState> & PersistPartial;
export type AppDispatch = typeof store.dispatch;
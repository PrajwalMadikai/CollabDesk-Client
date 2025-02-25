"use client";
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import storage from 'redux-persist/lib/storage';
import adminReducer from './slice/adminSlice';
import planReducer from './slice/planSlice';
import userReducer from './slice/userSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'admin', 'plan'],
  writeFailHandler: (err:any) => {
    console.warn('Redux persist write failed:', err);
  },
  timeout: 0, // Disable timeout
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
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Ignore these action types to prevent serialization errors
        ignoredPaths: ['register.step', 'some.other.path'],
      },
    }),
});

export const persistor = persistStore(store);

// Ensure store is rehydrated
let storeReady = false;
persistor.subscribe(() => {
  if (!storeReady) {
    storeReady = true;
  }
});

export type RootState = ReturnType<typeof store.getState> & PersistPartial;
export type AppDispatch = typeof store.dispatch;
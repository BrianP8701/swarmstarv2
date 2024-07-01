// app/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from "redux";

import appReducer from './appSlice';

const persistConfig = {
  key: 'sunuxu',
  storage,
};

const rootReducer = combineReducers({
  app: appReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER']
    }
  })
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;

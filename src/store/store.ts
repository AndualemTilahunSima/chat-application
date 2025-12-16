// src/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

import authReducer from "./slices/authSlice";
import chatThreadReducer from "./slices/chatThreadSlice";
import chatMessageReducer from "./slices/chatMessageSlice";

import {
  authPersistConfig,
  chatThreadsPersistConfig,
  chatMessagesPersistConfig,
} from "./persistConfig";

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  chatThreads: persistReducer(chatThreadsPersistConfig, chatThreadReducer),
  chatMessages: persistReducer(chatMessagesPersistConfig, chatMessageReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// src/persistConfigs.ts
import localForage from "localforage";

export const authPersistConfig = {
  key: "auth",
  storage: localForage,
};

export const chatThreadsPersistConfig = {
  key: "chatThreads",
  storage: localForage,
};

export const chatMessagesPersistConfig = {
  key: "chatMessages",
  storage: localForage,
};

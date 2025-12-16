// chatThreadSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
// import chatData from "../../assets/threads.json";

// Types
export type ChatThread = {
  id: number;
  name: string;
  avatar: string;
  preview: string;
  time: string;
  unread?: number;
};

export type ChatThreadState = {
  loading: boolean;
  error?: string | null;
  threads: ChatThread[];
  currentThread?: { id: number };
};

// Async thunk — loads chat threads
export const loadChatThreads = createAsyncThunk<
  ChatThread[],
  void,
  { rejectValue: string }
>("chat/loadChatThreads", async (_, { rejectWithValue }) => {
  try {
    let chatData = await fetch("/assets/threads.json").then(res => res.json());
    const threads = chatData.chatThreads;

    if (!threads || threads.length === 0) {
      return rejectWithValue("No chat threads found");
    }

    return threads;
  } catch (err: any) {
    return rejectWithValue(err?.message || "Failed to load chat threads");
  }
});

const initialState: ChatThreadState = {
  loading: false,
  error: null,
  threads: [],
};

// Slice
const chatThreadSlice = createSlice({
  name: "chatThreads",
  initialState,
  reducers: {
    clearChatThreads(state) {
      state.threads = [];
      state.error = null;
      state.loading = false;
    },
    markThreadAsRead(state, action: PayloadAction<number>) {
      const thread = state.threads.find((t) => t.id === action.payload);
      if (thread) {
        thread.unread = 0;
      }
    },

    // Optional: Update preview text
    updatePreview(
      state,
      action: PayloadAction<{ id: number; preview: string }>
    ) {
      const thread = state.threads.find((t) => t.id === action.payload.id);
      if (thread) {
        thread.preview = action.payload.preview;
      }
    },


    selectChatThread(
      state,
      action: PayloadAction<{ id: number }>
    ) {
      const thread = state.threads.find((t) => t.id === action.payload.id);
      if (thread) {
        state.currentThread = { id: action.payload.id };
      }

    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadChatThreads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadChatThreads.fulfilled, (state, action) => {
        state.loading = false;
        state.threads = action.payload;
      })
      .addCase(loadChatThreads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to load chat threads";
      });
  },
});

export const { markThreadAsRead, updatePreview, selectChatThread, clearChatThreads } = chatThreadSlice.actions;
export default chatThreadSlice.reducer;

// Selectors
export const selectChatThreads = (state: RootState) =>
  state.chatThreads.threads;

export const selectChatThreadsLoading = (state: RootState) =>
  state.chatThreads.loading;

export const selectChatThreadsError = (state: RootState) =>
  state.chatThreads.error;

export const selectCurrentThread = (state: RootState) =>
  state.chatThreads.currentThread;

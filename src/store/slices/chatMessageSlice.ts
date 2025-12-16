// chatMessageSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

import chatMessagesData from "../../assets/messages.json";

export type ChatMessage = {
  side: "left" | "right";
  text: string;
  time: string;
};

export type ChatMessageState = {
  loading: boolean;
  error?: string | null;
  chatMessagesByThread: Record<string, ChatMessage[]>;
};

export const loadMessagesByThread = createAsyncThunk<
  ChatMessage[],
  number,
  { state: RootState; rejectValue: string }
>(
  "chatMessages/loadMessagesByThread",
  async (threadId, { getState, rejectWithValue }) => {
    const state = getState();

    // Convert to string key
    const key = String(threadId);

    if (state.chatMessages.chatMessagesByThread[key]) {
      return state.chatMessages.chatMessagesByThread[key];
    }

    try {
      const messages = chatMessagesData.chatMessagesByThread[key];

      if (!messages) {
        return rejectWithValue("No messages found for this thread");
      }

      return messages;
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to load messages");
    }
  }
);


const initialState: ChatMessageState = {
  loading: false,
  error: null,
  chatMessagesByThread: {},
};

const chatMessageSlice = createSlice({
  name: "chatMessages",
  initialState,
  reducers: {
    clearMessage(state) {
      state.chatMessagesByThread = {};
      state.error = null;
      state.loading = false;
    },
    addMessage(
      state,
      action: PayloadAction<{ threadId: number; message: ChatMessage }>
    ) {
      const { threadId, message } = action.payload;
      const key = String(threadId);

      if (!state.chatMessagesByThread[key]) {
        state.chatMessagesByThread[key] = [];
      }

      state.chatMessagesByThread[key].push(message);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadMessagesByThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMessagesByThread.fulfilled, (state, action) => {
        state.loading = false;

        // Save messages under correct thread
        // threadId comes from meta.arg
        const threadId = String(action.meta.arg);
        state.chatMessagesByThread[threadId] = action.payload;
      })
      .addCase(loadMessagesByThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to load chat messages";
      });
  },
});

// Export actions
export const { addMessage, clearMessage } = chatMessageSlice.actions;

// Export reducer
export default chatMessageSlice.reducer;

// Selectors
export const selectMessagesByThread = (threadId: number) => (state: RootState) =>
  state.chatMessages.chatMessagesByThread[String(threadId)] ?? [];

export const selectMessageLoading = (state: RootState) =>
  state.chatMessages.loading;

export const selectMessageError = (state: RootState) =>
  state.chatMessages.error;

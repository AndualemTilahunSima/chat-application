// chatMessageSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// Utility function to decode JWT token
function decodeJWT(token: string): { sub?: string; email?: string } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

export type ChatMessage = {
  id?: string;
  threadId: string;
  senderId?: string;
  receiverId?: string;
  side: "left" | "right";
  text: string;
  time: string;
  isRead?: boolean;
  createdAt?: Date;
};

export type ChatMessageState = {
  loading: boolean;
  error?: string | null;
  chatMessagesByThread: Record<string, ChatMessage[]>;
  userId?: string; // Store current user ID for determining message side
};

export const loadMessagesByThread = createAsyncThunk<
  ChatMessage[],
  string,
  { state: RootState; rejectValue: string }
>(
  "chatMessages/loadMessagesByThread",
  async (threadId, { getState, rejectWithValue }) => {
    const state = getState();
    const profile = state.auth.profile;

    if (!profile?.token) {
      return rejectWithValue("Not authenticated");
    }

    try {
      const response = await fetch(`http://localhost:3001/messaging/threads/${threadId}/messages`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${profile.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const messages = await response.json();
      
      // Get current user ID from token
      const decoded = decodeJWT(profile.token);
      const currentUserId = decoded?.sub;
      
      // Transform backend messages to frontend format
      const transformedMessages: ChatMessage[] = messages.map((msg: any) => ({
        id: msg.id,
        threadId: msg.threadId,
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        side: msg.senderId === currentUserId ? "right" : "left",
        text: msg.text,
        time: new Date(msg.createdAt).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        isRead: msg.isRead,
        createdAt: new Date(msg.createdAt),
      }));

      return transformedMessages;
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to load messages");
    }
  }
);

export const sendMessage = createAsyncThunk<
  ChatMessage,
  { threadId: string; receiverId: string; text: string },
  { state: RootState; rejectValue: string }
>(
  "chatMessages/sendMessage",
  async ({ threadId, receiverId, text }, { getState, rejectWithValue }) => {
    const state = getState();
    const profile = state.auth.profile;

    if (!profile?.token) {
      return rejectWithValue("Not authenticated");
    }

    try {
      const response = await fetch("http://localhost:3001/messaging/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${profile.token}`,
        },
        body: JSON.stringify({ threadId, receiverId, text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const message = await response.json();
      
      // Transform backend message to frontend format
      return {
        id: message.id,
        threadId: message.threadId,
        senderId: message.senderId,
        receiverId: message.receiverId,
        side: "right",
        text: message.text,
        time: new Date(message.createdAt).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        isRead: message.isRead,
        createdAt: new Date(message.createdAt),
      };
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to send message");
    }
  }
);

export const markThreadAsRead = createAsyncThunk<
  void,
  string,
  { state: RootState; rejectValue: string }
>(
  "chatMessages/markThreadAsRead",
  async (threadId, { getState, rejectWithValue }) => {
    const state = getState();
    const profile = state.auth.profile;

    if (!profile?.token) {
      return rejectWithValue("Not authenticated");
    }

    try {
      const response = await fetch(`http://localhost:3001/messaging/threads/${threadId}/read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${profile.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to mark thread as read");
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
      action: PayloadAction<{ threadId: string; message: ChatMessage }>
    ) {
      const { threadId, message } = action.payload;
      const key = String(threadId);

      if (!state.chatMessagesByThread[key]) {
        state.chatMessagesByThread[key] = [];
      }

      // Check if message already exists (avoid duplicates)
      const exists = state.chatMessagesByThread[key].some(
        (msg) => msg.id === message.id
      );
      
      if (!exists) {
        state.chatMessagesByThread[key].push(message);
      }
    },
    setUserId(state, action: PayloadAction<string>) {
      state.userId = action.payload;
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
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const message = action.payload;
        const key = String(message.threadId);
        
        if (!state.chatMessagesByThread[key]) {
          state.chatMessagesByThread[key] = [];
        }
        
        const exists = state.chatMessagesByThread[key].some(
          (msg) => msg.id === message.id
        );
        
        if (!exists) {
          state.chatMessagesByThread[key].push(message);
        }
      })
      .addCase(markThreadAsRead.fulfilled, (state, action) => {
        const threadId = String(action.meta.arg);
        const messages = state.chatMessagesByThread[threadId];
        if (messages) {
          messages.forEach((msg) => {
            msg.isRead = true;
          });
        }
      });
  },
});

// Export actions
export const { addMessage, clearMessage, setUserId } = chatMessageSlice.actions;

// Export reducer
export default chatMessageSlice.reducer;

// Selectors
export const selectMessagesByThread = (threadId: string | number) => (state: RootState) =>
  state.chatMessages.chatMessagesByThread[String(threadId)] ?? [];

export const selectMessageLoading = (state: RootState) =>
  state.chatMessages.loading;

export const selectMessageError = (state: RootState) =>
  state.chatMessages.error;

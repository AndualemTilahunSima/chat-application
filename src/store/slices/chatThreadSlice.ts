// chatThreadSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// Types
export type ChatThread = {
  /**
   * Thread id from messaging-service (Mongo ObjectId/UUID as string)
   */
  id: string;
  /**
   * Display name of the other participant (built from user-service)
   */
  name: string;
  /**
   * Avatar URL or placeholder
   */
  avatar: string;
  /**
   * Last message preview text
   */
  preview: string;
  /**
   * Human-readable time for last message / thread activity
   */
  time: string;
  /**
   * Unread message count for this thread
   */
  unread?: number;
  /**
   * All participant user IDs in this thread
   */
  participantIds: string[];
  /**
   * Convenience: the "other" user's id in the thread
   */
  receiverId: string;
  /**
   * Online status of the "other" user in this thread
   */
  status?: "online" | "offline";
};

export type ChatThreadState = {
  loading: boolean;
  error?: string | null;
  threads: ChatThread[];
  currentThread?: { id: string };
};

// Utility function to decode JWT token
function decodeJWT(token: string): { sub?: string; email?: string } | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

// Async thunk — loads chat threads from backend services
export const loadChatThreads = createAsyncThunk<
  ChatThread[],
  void,
  { state: RootState; rejectValue: string }
>("chat/loadChatThreads", async (_, { getState, rejectWithValue }) => {
  const state = getState();
  const profile = state.auth.profile;

  if (!profile?.token) {
    return rejectWithValue("Not authenticated");
  }

  try {
    // 1) Load raw threads from messaging-service
    const threadsResponse = await fetch(
      "http://localhost:3001/messaging/threads",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${profile.token}`,
        },
      }
    );

    if (!threadsResponse.ok) {
      throw new Error(`HTTP error! status: ${threadsResponse.status}`);
    }

    const rawThreads: Array<{
      id: string;
      participantIds: string[];
      lastMessage?: { text: string; senderId: string; createdAt: string };
      lastMessageAt?: string;
      unreadCount?: number;
      createdAt: string;
      updatedAt: string;
    }> = await threadsResponse.json();

    if (!rawThreads || rawThreads.length === 0) {
      return rejectWithValue("No chat threads found");
    }

    // Decode current user id from JWT
    const decoded = decodeJWT(profile.token);
    const currentUserId = decoded?.sub;

    // Collect "other" user ids to batch fetch their online status
    const otherUserIds = Array.from(
      new Set(
        rawThreads
          .map((thread) => {
            const participants = thread.participantIds || [];
            return (
              participants.find((id) => id !== currentUserId) ?? participants[0]
            );
          })
          .filter((id): id is string => !!id)
      )
    );

    let statusMap: Record<string, "online" | "offline"> = {};

    if (otherUserIds.length > 0) {
      try {
        const statusResponse = await fetch(
          `http://localhost:3001/messaging/status/users?userIds=${encodeURIComponent(
            otherUserIds.join(",")
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${profile.token}`,
            },
          }
        );

        if (statusResponse.ok) {
          statusMap = await statusResponse.json();
        }
      } catch (error) {
        console.error("Failed to load users status", error);
      }
    }

    // 2) For each thread, load the "other" user from user-service to build
    //    display name and avatar.
    const enrichedThreads: ChatThread[] = [];

    for (const thread of rawThreads) {
      const participantIds = thread.participantIds || [];
      const otherUserId =
        participantIds.find((id) => id !== currentUserId) ?? participantIds[0];

      let name = "Conversation";
      let avatar =
        "https://ui-avatars.com/api/?name=User&background=random&size=100";

      if (otherUserId) {
        try {
          const userResponse = await fetch(
            `http://localhost:3000/users/${otherUserId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${profile.token}`,
              },
            }
          );

          if (userResponse.ok) {
            const user = await userResponse.json();
            const firstName = user.firstName ?? "";
            const lastName = user.lastName ?? "";
            const fullName = `${firstName} ${lastName}`.trim();

            if (fullName) {
              name = fullName;
              avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                fullName
              )}&background=random&size=100`;
            }
          }
        } catch (error) {
          console.error(
            "Failed to load user info for thread",
            thread.id,
            error
          );
        }
      }

      const lastActivity =
        thread.lastMessageAt ?? thread.createdAt ?? new Date().toISOString();
      const time = new Date(lastActivity).toLocaleString();

      enrichedThreads.push({
        id: thread.id,
        name,
        avatar,
        preview: thread.lastMessage?.text ?? "",
        time,
        unread: thread.unreadCount ?? 0,
        participantIds,
        receiverId: otherUserId ?? "",
        status: otherUserId ? statusMap[otherUserId] ?? "offline" : "offline",
      });
    }

    return enrichedThreads;
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
    markThreadAsRead(state, action: PayloadAction<string>) {
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

    selectChatThread(state, action: PayloadAction<{ id: string }>) {
      const thread = state.threads.find((t) => t.id === action.payload.id);
      if (thread) {
        state.currentThread = { id: action.payload.id };
      }
    },
    setThreadStatusForUser(
      state,
      action: PayloadAction<{ userId: string; status: "online" | "offline" }>
    ) {
      const { userId, status } = action.payload;
      state.threads.forEach((thread) => {
        if (thread.receiverId === userId) {
          thread.status = status;
        }
      });
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

export const {
  markThreadAsRead,
  updatePreview,
  selectChatThread,
  clearChatThreads,
  setThreadStatusForUser,
} = chatThreadSlice.actions;
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

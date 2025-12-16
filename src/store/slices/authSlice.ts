// ...existing code...
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { PayloadAction } from "@reduxjs/toolkit";
import userInfo from "../../assets/users.json";



export type AuthState = {
  loading: boolean;
  error?: string | null;
  profile?: {
    profileImage: string;
    displayName: string;
    email: string;
    token?: string;
  } | null;
};

// Example response shape we expect from API
type LoginResponse = {
  profileImage: string;
  displayName: string;
  email: string;
  token?: string;
};

// Async thunk for login
export const loginUser = createAsyncThunk<
  LoginResponse,
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      // Find user from JSON
      // const user = userInfo.users.find(
      //   (u) => u.email === credentials.email && u.password === credentials.password
      // );
      // let users = await fetch("/assets/users.json").then(res => res.json());

      const loginData = credentials;

      const loggedInUser = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .catch((err) => console.error(err));

      // const user = (await users).users.find(
      //   (u: { email: string; password: string }) => u.email === credentials.email && u.password === credentials.password
      // );

      if (!loggedInUser) {
        return rejectWithValue('Incorrect email or password');
      }

      // Simulate backend response
      const data = loggedInUser;
      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Network error');
    }
  }
);


export const logoutUser = async (token?: string) => {
  if (!token) return false;

  try {
    await fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token }),
    });

    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
};



const initialState: AuthState = {
  loading: false,
  error: null,
  profile: null,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
             state.profile = null;
          state.error = null;

      // fetch("http://localhost:3000/auth/logout", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ token: state.profile?.token }),
      // })
      //   .then((res) => {
      //     if (!res.ok) {
      //       throw new Error(`HTTP error! status: ${res.status}`);
      //     }
      //     state.profile = null;
      //     state.error = null;
      //     return res.json();
      //   })
      //   .catch((err) => console.error(err));

      // localStorage.removeItem("authProfile");
    },
    restoreProfile(state, action: PayloadAction<AuthState["profile"]>) {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.profile = {
          profileImage: action.payload.profileImage,
          displayName: action.payload.displayName,
          email: action.payload.email,
          token: action.payload.token,
        };
        // persist minimal profile locally
        // localStorage.setItem(
        //     "authProfile",
        //     JSON.stringify(state.profile)
        // );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        // if we returned a rejectWithValue string, it appears in action.payload
        state.error = action.payload ?? "Incorrect credentials";
      });
  },
});
// ...existing code...
export const { logout, restoreProfile } = authSlice.actions;
export default authSlice.reducer;

// selector helpers
export const selectAuthProfile = (state: RootState) => state.auth.profile;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
// ...existing code...
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { PayloadAction } from "@reduxjs/toolkit";
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

export type AuthState = {
  loading: boolean;
  error?: string | null;
  successMessage?: string | null;
  profile?: {
    profileImage: string;
    profileImageUrl?: string;
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

// Async thunk for user registration
export const registerUser = createAsyncThunk<
  { message: string },
  { email: string; phoneNumber: string; firstName: string; lastName: string; password: string },
  { rejectValue: string }
>(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Handle NestJS validation errors which can be string or array
        let errorMessage = `HTTP error! status: ${response.status}`;
        if (errorData.message) {
          if (Array.isArray(errorData.message)) {
            errorMessage = errorData.message.join(', ');
          } else {
            errorMessage = errorData.message;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return { message: data.message || 'User registered successfully' };
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

// Async thunk for uploading profile image
export const uploadProfileImage = createAsyncThunk<
  { profileImageUrl: string },
  { file: File; token: string },
  { rejectValue: string }
>(
  'auth/uploadProfileImage',
  async ({ file, token }, { rejectWithValue }) => {
    try {
      // Decode JWT to get user ID
      const decoded = decodeJWT(token);
      if (!decoded || !decoded.sub) {
        return rejectWithValue('Invalid token: unable to get user ID');
      }

      const userId = decoded.sub;

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`http://localhost:3000/users/${userId}/profile-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { profileImageUrl: data.profileImageUrl };
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to upload profile image');
    }
  }
);



const initialState: AuthState = {
  loading: false,
  error: null,
  successMessage: null,
  profile: null,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
    logout(state) {
             state.profile = null;
          state.error = null;
          state.successMessage = null;

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
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.successMessage = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Registration failed";
        state.successMessage = null;
      })
      .addCase(uploadProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (state.profile) {
          state.profile.profileImageUrl = action.payload.profileImageUrl;
        }
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to upload profile image";
      });
  },
});
// ...existing code...
export const { logout, restoreProfile, clearSuccessMessage } = authSlice.actions;
export default authSlice.reducer;

// selector helpers
export const selectAuthProfile = (state: RootState) => state.auth.profile;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthSuccessMessage = (state: RootState) => state.auth.successMessage;
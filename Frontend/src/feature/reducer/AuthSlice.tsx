import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  username?: string;
  fullName?: {
    firstName: string;
    lastName: string;
  };
  email?: string;
  isAuthenticated: boolean;
}

export interface AuthWithPassword extends AuthState {
  password: string;
  confirmPassword: string;
}

const initialState: AuthWithPassword = {
  username: "",
  fullName: {
    firstName: "",
    lastName: "",
  },
  email: "",
  isAuthenticated: false,
  password: "",
  confirmPassword: "",
};

export type RegisterPayload = Pick<AuthState, "fullName" | "email" | "username">;

export type LoginPayload = Pick<AuthState, "email" | "username">;

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    register: (state, action: PayloadAction<RegisterPayload>) => {
      state.username = action.payload.username;
      state.fullName = action.payload.fullName;
      state.email = action.payload.email;
      state.isAuthenticated = true;
      state.password = "";
      state.confirmPassword = "";
    },

    login: (state, action: PayloadAction<LoginPayload>) => {
      state.email = action.payload.email;
      state.username = action.payload.username || "";
      state.isAuthenticated = true;
      state.password = "";
      state.confirmPassword = "";
    },

    logout: (state) => {
      Object.assign(state, initialState);
    },

    updateField: (state, action: PayloadAction<{ field: string; value: string }>) => {
      const { field, value } = action.payload;
      if (field === "firstName" || field === "lastName") {
        if (!state.fullName) state.fullName = { firstName: "", lastName: "" };
        state.fullName[field] = value;
      } else {
        (state as any)[field] = value;
      }
    },
  },
});

export const { register, login, logout, updateField } = AuthSlice.actions;

export default AuthSlice.reducer;
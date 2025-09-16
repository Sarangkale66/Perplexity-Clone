import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface SocketState {
  connected: boolean;
  currentRoom: string | null;
  error: string | null;
}

const initialState: SocketState = {
  connected: false,
  currentRoom: null,
  error: null,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    connectSocket: () => { },

    disconnectSocket: () => { },

    joinRoom: (state, action: PayloadAction<string>) => {
      state.currentRoom = action.payload;
    },

    leaveRoom: (state) => {
      state.currentRoom = null;
    },

    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
      if (!action.payload) {
        state.currentRoom = null;
      }
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  connectSocket,
  disconnectSocket,
  joinRoom,
  leaveRoom,
  setConnected,
  setError,
} = socketSlice.actions;

export default socketSlice.reducer;
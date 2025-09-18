import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { io, type Socket } from "socket.io-client";
import Cookies from "js-cookie";
import type { AppDispatch } from "../../store/store";

let socket: Socket | null = null;
const token = Cookies.get("token") || "";

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
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
      if (!action.payload) {
        state.currentRoom = null;
      }
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCurrentRoom: (state, action: PayloadAction<string | null>) => {
      state.currentRoom = action.payload;
    },
  },
});

export const { setConnected, setError, setCurrentRoom } = socketSlice.actions;
export default socketSlice.reducer;

export const connectSocket = (url: string) => (dispatch: AppDispatch) => {
  if (!socket) {
    socket = io(url, {
      autoConnect: true,
      transports: ["websocket"],
      withCredentials: true,
      extraHeaders: { Cookie: token },
    });

    socket.on("connect", () => {
      console.log("connected");

      dispatch(setConnected(true));
      dispatch(setError(null));
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
      dispatch(setConnected(false));
      dispatch(setCurrentRoom(null));
    });

    socket.on("connect_error", (err: any) => {
      dispatch(setError(err.message));
      console.error("Socket connect error:", err.message);
    });
  }
};

export const disconnectSocket = () => (dispatch: AppDispatch) => {
  if (socket) {
    socket.disconnect();
    socket = null;
    dispatch(setConnected(false));
    dispatch(setCurrentRoom(null));
    dispatch(setError(null));
  }
};

export const joinRoom = (roomId: string) => (dispatch: AppDispatch, getState: () => { socket: SocketState }) => {
  const state = getState().socket;
  if (socket && state.connected) {
    dispatch(setCurrentRoom(roomId));
  }
};

export const leaveRoom = () => (dispatch: AppDispatch, getState: () => { socket: SocketState }) => {
  const state = getState().socket;
  if (socket && state.currentRoom) {
    dispatch(setCurrentRoom(null));
  }
};

export const getSocketInstance = (): Socket | null => socket;

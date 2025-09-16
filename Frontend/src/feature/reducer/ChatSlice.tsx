import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "./AuthSlice";

export interface Message {
  role: "user" | "model";
  message: string;
  timestamp: number;
}

export interface ChatState {
  _id: string;
  user: AuthState;
  title: string;
}

export interface ChatSliceState {
  chats: ChatState[];
  messages: Record<string, Message[]>;
  roomOrder: string[];
}

const MAX_CHATS = 3;

const initialState: ChatSliceState = {
  chats: [],
  messages: {},
  roomOrder: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addChat: (state, action: PayloadAction<ChatState>) => {
      const chat = action.payload;

      state.chats = state.chats.filter((c) => c._id !== chat._id);
      state.chats.push(chat);

      state.roomOrder = state.roomOrder.filter((id) => id !== chat._id);
      state.roomOrder.push(chat._id);

      if (!state.messages[chat._id]) {
        state.messages[chat._id] = [];
      }

      while (state.roomOrder.length > MAX_CHATS) {
        const oldest = state.roomOrder.shift();
        if (oldest) {
          delete state.messages[oldest];
          state.chats = state.chats.filter((c) => c._id !== oldest);
        }
      }
    },

    removeChat: (state, action: PayloadAction<string>) => {
      const roomId = action.payload;
      state.chats = state.chats.filter((c) => c._id !== roomId);
      delete state.messages[roomId];
      state.roomOrder = state.roomOrder.filter((id) => id !== roomId);
    },

    addMessage: (
      state,
      action: PayloadAction<{ roomId: string; role: "user" | "model"; message: string }>
    ) => {
      const { roomId, role, message } = action.payload;
      if (!state.messages[roomId]) {
        state.messages[roomId] = [];
      }
      state.messages[roomId].push({
        role,
        message,
        timestamp: Date.now(),
      });
    },

    clearMessages: (state, action: PayloadAction<string>) => {
      state.messages[action.payload] = [];
    },

    clearChats: (state) => {
      state.chats = [];
      state.messages = {};
      state.roomOrder = [];
    },
  },
});

export const { addChat, removeChat, addMessage, clearMessages, clearChats } =
  chatSlice.actions;

export default chatSlice.reducer;

// Join a new chat
// dispatch(addChat({ _id: "room1", user: authUser, title: "Room 1" }));

// Add messages
// dispatch(addMessage({ roomId: "room1", role: "user", message: "Hello Room 1" }));
// dispatch(addMessage({ roomId: "room1", role: "bot", message: "Hi there!" }));

// Remove a chat
// dispatch(removeChat("room1"));

// Clear only messages of a chat
// dispatch(clearMessages("room1"));

// Clear everything
// dispatch(clearChats());
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Message {
  role: string;
  message: string;
  timestamp: number;
}

export interface ChatState {
  _id: string;
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
      const existingIndex = state.chats.findIndex((c) => c._id === chat._id);
      if (existingIndex >= 0) {
        state.chats[existingIndex] = chat;
      } else {
        state.chats.unshift(chat);
      }

      if (!state.messages[chat._id]) {
        state.messages[chat._id] = [];
      }

      state.roomOrder = state.roomOrder.filter((id) => id !== chat._id);
      state.roomOrder.push(chat._id);

      while (state.roomOrder.length > MAX_CHATS) {
        const oldest = state.roomOrder.shift();
        if (oldest) {
          delete state.messages[oldest];
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
      action: PayloadAction<{ roomId: string; role: string; message: string }>
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

    appendToLastAssistantMessage: (
      state,
      action: PayloadAction<{ roomId: string; chunk: string }>
    ) => {
      const { roomId, chunk } = action.payload;
      const msgs = state.messages[roomId] || [];

      if (msgs.length > 0 && msgs[msgs.length - 1].role === "model") {
        msgs[msgs.length - 1].message += chunk;
      } else {
        msgs.push({
          role: "model",
          message: chunk,
          timestamp: Date.now(),
        });
      }

      state.messages[roomId] = msgs;
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

export const {
  addChat,
  removeChat,
  addMessage,
  appendToLastAssistantMessage,
  clearMessages,
  clearChats,
} = chatSlice.actions;

export default chatSlice.reducer;
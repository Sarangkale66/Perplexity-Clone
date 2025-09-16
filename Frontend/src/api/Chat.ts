import type { ChatState } from "../feature/reducer/ChatSlice"
import api from ".";

export const createChat = async (obj: Pick<ChatState, "title">) => {
  const res = await api.post("/chat", obj);
  return res.data;
}

export const getChats = async () => {
  const res = await api.get("/chat");
  console.log(res.data);

  return res.data;
}
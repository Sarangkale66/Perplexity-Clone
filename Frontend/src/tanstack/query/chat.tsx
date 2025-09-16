import { useQuery } from "@tanstack/react-query";
import { getChats } from "../../api/Chat";

export const useChatsQuery = () => useQuery({
  queryKey: ["chats"],
  queryFn: getChats
});

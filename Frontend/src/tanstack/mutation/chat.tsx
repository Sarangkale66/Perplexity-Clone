import { useMutation } from "@tanstack/react-query";
import { createChat } from "../../api/Chat";

export const useChatMutation = () => {
  const createChatMutation = useMutation({
    mutationFn: createChat,
  });

  return [createChatMutation];
}
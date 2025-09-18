import { type QueryFunctionContext } from "@tanstack/react-query";
import api from ".";

export interface FetchMessagesResponse {
  messages: any[];
  nextPage?: number;
  prevPage?: number;
}

export const fetchMessages = async (
  { queryKey, pageParam = 1 }: QueryFunctionContext<[string, { chatId: string }], number>
): Promise<FetchMessagesResponse> => {
  const [_key, { chatId }] = queryKey;

  const { data } = await api.get("/messages", {
    params: { chatId, page: pageParam, limit: 20 },
  });

  return {
    messages: data.messages,
    nextPage: data.hasMore ? pageParam + 1 : undefined,
    prevPage: pageParam > 1 ? pageParam - 1 : undefined,
  };
};

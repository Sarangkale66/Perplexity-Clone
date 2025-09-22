import { useLocation, useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Send, Clipboard, BrainCircuit } from "lucide-react";
import "./DynamicChat.css";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { getSocketInstance } from "../../feature/socketReducer/SocketSlice";
import {
  addMessage,
  appendToLastAssistantMessage,
  prependMessage,
  clearMessages,
  type Message,
} from "../../feature/chatReducer/ChatSlice";

import { useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchMessages,
  type FetchMessagesResponse,
} from "../../api/Message";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import SpeechToTextButton from "../../component/SpeechToTextButton";

const EMPTY_MESSAGES: Message[] = [];

const DynamicChat = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const reduxMessages = useSelector((state: RootState) =>
    id && state.chat.messages[id] ? state.chat.messages[id] : EMPTY_MESSAGES
  );

  const socket = getSocketInstance();
  const location = useLocation();
  const { message, fromHome } = location.state || {};
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const textRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasSentInitial = useRef(false);

  const [isAtBottom, setIsAtBottom] = useState(true);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<FetchMessagesResponse>({
    queryKey: ["messages", { chatId: id }], //@ts-ignore
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    enabled: !!id,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = async () => {
      const scrolledRatio =
        container.scrollTop / (container.scrollHeight - container.clientHeight);

      if (scrolledRatio <= 0.3 && hasNextPage && !isFetchingNextPage) {
        await fetchNextPage();
      }

      const threshold = 50;
      const atBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        threshold;
      setIsAtBottom(atBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (!isAtBottom) return;

    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [reduxMessages.length, isAtBottom]);

  useEffect(() => {
    if (!data || !id) return;

    const allMessages = data.pages.flatMap((p: any) => p.messages);

    allMessages.forEach((msg) => {
      dispatch(
        addMessage({
          roomId: id,
          role: msg.role,
          message: msg.text,
        })
      );
    });

    return () => {
      if (id) {
        dispatch(clearMessages(id));
      }
    };

  }, [id, data, dispatch]);


  useEffect(() => {
    if (!hasSentInitial.current && fromHome && message && id) {
      socket?.emit("ai-message", {
        chatId: id,
        message,
      });
      hasSentInitial.current = true;
    }

    socket?.on("ai-response", (chunk: string) => {
      const { txt, chatId } = JSON.parse(chunk);
      dispatch(
        appendToLastAssistantMessage({
          roomId: chatId || id,
          chunk: txt,
        })
      );
    });

    return () => {
      socket?.off("ai-response");
    };
  }, [message, fromHome, id, socket]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const elem = textRef.current;
    if (!elem || !elem.value.trim() || !id) return;

    const newMessage = elem.value.trim();

    dispatch(prependMessage({ roomId: id, role: "user", message: newMessage }));

    socket?.emit("ai-message", {
      chatId: id,
      message: newMessage,
    });

    elem.value = "";
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const title =
    message && message.length <= 20
      ? message
      : message?.slice(0, 20) + "...";

  return (
    <div ref={containerRef} className="chatgpt-page">
      <nav className="nav-bar">
        <BrainCircuit />
        <span className="chat-title">{title}</span>
      </nav>

      <div className="chat-container">
        <div className="chatgpt-messages">
          <div ref={bottomRef} />
          {reduxMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`chatgpt-message ${msg.role === "user" ? "user" : "assistant"
                }`}
            >
              <div className="chatgpt-bubble">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {msg.message}
                </ReactMarkdown>
              </div>

              {msg.role === "model" && (
                <div className="copy-btn-container">
                  <button
                    className="copy-btn"
                    onClick={() => handleCopy(msg.message, idx)}
                  >
                    <Clipboard size={14} />
                  </button>
                  {copiedIndex === idx && (
                    <span className="copied-text">Copied!</span>
                  )}
                </div>
              )}
            </div>
          ))}

          {isFetchingNextPage && (
            <div className="loading">Loading more...</div>
          )}
        </div>
      </div>

      <div className="input-container w-full bg-[#121212]">
        <div className="chatgpt-input">
          <textarea
            ref={textRef}
            placeholder="Message ChatGPT"
            rows={3}
            onKeyDown={handleKeyDown}
          />
          <div className="actions">
            <SpeechToTextButton textRef={textRef} />
            <div className="enter" onClick={handleSubmit}>
              <Send size={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicChat;
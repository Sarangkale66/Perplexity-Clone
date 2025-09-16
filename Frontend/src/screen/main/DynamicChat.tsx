import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Mic, Send, Clipboard } from "lucide-react";
import "./DynamicChat.css";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { getSocketInstance } from "../../feature/socketReducer/SocketSlice";
import {
  addMessage,
  appendToLastAssistantMessage,
  type Message,
} from "../../feature/chatReducer/ChatSlice";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const EMPTY_MESSAGES: Message[] = [];

const DynamicChat = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentRoom } = useSelector((state: RootState) => state.socket);

  const messages = useSelector((state: RootState) =>
    currentRoom && state.chat.messages[currentRoom]
      ? state.chat.messages[currentRoom]
      : EMPTY_MESSAGES
  );

  const socket = getSocketInstance();
  const location = useLocation();
  const { message, fromHome } = location.state || {};
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (fromHome && message) {
      dispatch(addMessage({ roomId: currentRoom!, role: "user", message }));

      socket?.emit("ai-message", {
        chatId: currentRoom,
        message,
      });
    }

    socket?.on("ai-response", (chunk: string) => {
      if (!chunk) return;

      dispatch(
        appendToLastAssistantMessage({
          roomId: currentRoom!,
          chunk,
        })
      );
    });

    return () => {
      socket?.off("ai-response");
    };
  }, [message, fromHome, currentRoom, dispatch, socket]);

  const textRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const elem = textRef.current;
    if (!elem || !elem.value.trim()) return;

    const newMessage = elem.value.trim();

    dispatch(addMessage({ roomId: currentRoom!, role: "user", message: newMessage }));

    socket?.emit("ai-message", {
      chatId: currentRoom,
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
    message && message.length <= 20 ? message : message?.slice(0, 20) + "...";

  return (
    <div className="chatgpt-page">
      <nav className="nav-bar">
        <span className="chat-title">{title}</span>
      </nav>

      <div className="chat-container">
        <div className="chatgpt-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chatgpt-message ${msg.role === "user" ? "user" : "assistant"}`}
            >
              <div className="chatgpt-bubble">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {msg.message}
                </ReactMarkdown>
              </div>

              {msg.role === "assistant" && (
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
            <div className="enter">
              <Mic size={18} />
            </div>
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

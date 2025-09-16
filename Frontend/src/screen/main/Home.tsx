import { Mic, Send, BrainCircuit } from "lucide-react"
import "./Home.css"
import { useRef } from "react"
import { useNavigate } from "react-router-dom";
import { useChatMutation } from "../../tanstack/mutation/chat"
import { useChatsQuery } from "../../tanstack/query/chat";
import queryClient from "../../tanstack/QueryClient";
import { useDispatch } from "react-redux";

const Home = () => {
  const dispatch = useDispatch();
  const textRef = useRef(null);
  const navigate = useNavigate();
  const [createChatMutation] = useChatMutation();
  const { refetch } = useChatsQuery();


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const elem = textRef.current as unknown as HTMLTextAreaElement;
    if (!elem.value) return;
    const message = elem.value.trim();
    if (message) {
      createChatMutation.mutate({ title: message }, {
        onSuccess: (data) => {
          dispatch()
          // queryClient.invalidateQueries({ queryKey: ["chats"] });
          // refetch();
          navigate(`/${data.chat._id}`, {
            state: { message },
          })
        },
        onError: (error: any) => {
          alert(error.response?.data?.message || "Error during creating chat");
        },
      })

      elem.value = "";
    }
  };

  return (
    <div className="home-page">
      <nav>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5em",
          fontSize: "2em"
        }}>
          <BrainCircuit size={75} />
          <span>ChatGPT.o</span>
        </div>
      </nav>
      <div className="welcome">
        <p style={{ fontSize: "clamp(0.8rem, 2vw, 1.5rem)" }} >What’s on your plate right now?</p>
        <div className="search-box">
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
    </div >
  )
}

export default Home;
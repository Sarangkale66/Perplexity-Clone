import "./Sidebar.css"
import { FileText, EllipsisVertical, FilePlus2, PanelLeft, PanelLeftClose } from 'lucide-react';
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChatsQuery } from "../tanstack/query/chat";

export default function Sidebar() {
  const { data, isLoading, error } = useChatsQuery();
  const navigate = useNavigate();
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(true)
  const chats = data?.chats || [];

  const filteredChats = useMemo(() => {
    return chats.filter((c: any) =>
      (c.title || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [chats, search]);

  const createNewChat = () => {
    navigate("/");
  };

  if (isLoading) return <div>Loading chats...</div>;
  if (error) return <div>Failed to load chats</div>;


  return (
    <>
      {!isOpen && (
        <button className="toggle-btn" onClick={() => setIsOpen(true)}>
          <PanelLeft size={18} />
        </button>
      )}

      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div style={{
            display: "flex",
            justifyContent: "space-between"
          }}>
            <button onClick={createNewChat}><FilePlus2 size={15} /> New Chat</button>
            <button style={{ minWidth: 0 }} className="close-btn" onClick={() => setIsOpen(false)}>
              <PanelLeftClose size={18} />
            </button>
          </div>
          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="chat-list">
          {filteredChats.map((chat: {
            _id: string;
            title: string;
            user: string;
          }, i: number) => (
            <div
              key={i}
              className={`chat-item ${selected === chat.title ? "active" : ""}`}
              onClick={() => {
                setSelected(chat.title)
                navigate(`/${chat._id}`, {
                  state: { message: chat.title }
                })
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "center"
              }}>
                <FileText size={16} style={{ marginRight: "0.5em" }} />
                <span className="title">{chat.title}</span>
              </div>
              <div className="ellipsis" >
                <EllipsisVertical size={14} />
              </div>
            </div>
          ))}
        </div>
        <div className="user-profile">
          <div className="img-container">
            <img
              src="https://images.unsplash.com/photo-1564564244660-5d73c057f2d2?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3V5fGVufDB8fDB8fHww"
              alt="profile-image"
            />
          </div>
          <div className="section">
            <div>
              <h6 style={{
                maxWidth: "8em",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                fontSize: "0.7em"
              }}>Sarang Kale</h6>
              <h6 style={{ color: "gray", fontSize: "0.7em" }}>Free </h6>
            </div>
            <div>
              <button className="btn">Upgrade</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
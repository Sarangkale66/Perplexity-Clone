import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Mic, Send, Clipboard } from "lucide-react";
import "./DynamicChat.css";

interface messageInter {
  role: String;
  content: String;
}

const DynamicChat = () => {
  const location = useLocation();
  const { message } = location.state || {};

  const [messages, setMessages] = useState<messageInter[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    setMessages([
      { role: "user", content: message },
      { role: "assistant", content: "How can I help You?" },
    ]);
  }, [message]);

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

    const newMessage = { role: "user", content: elem.value.trim() };
    setMessages((prev) => [...prev, newMessage]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore mollitia dignissimos, qui excepturi ab blanditiis eius optio iste ut ad? Tenetur suscipit similique voluptatum ex quis voluptatibus porro corporis ab unde reprehenderit et, adipisci laudantium non eligendi esse! Sunt corrupti quis repellendus, dolorem nesciunt nulla, fugit ullam consequatur reiciendis ut consectetur placeat facere sequi distinctio culpa dolore? Itaque minus excepturi vitae praesentium, sint, hic esse soluta porro maiores cupiditate nulla! Placeat possimus exercitationem provident explicabo aliquam tempora ullam praesentium harum iste reprehenderit. Enim, ab sequi, quisquam numquam quia vero, facilis pariatur perferendis nihil ipsum laudantium totam excepturi at! Ab sunt officiis nesciunt. Fuga sunt eligendi provident maiores laborum alias ea molestiae minus obcaecati aliquam! Itaque ipsam, vitae, commodi voluptatum perferendis provident aliquid repellendus impedit quasi labore animi odit a asperiores nihil rem explicabo deleniti reiciendis dolor unde repellat aliquam quia quas. Dicta delectus, quod maxime vitae odio fuga? Culpa error consequuntur dolorem amet. Fugiat rem eos, sunt tempora sed dolor. Cumque, incidunt. Asperiores iste velit itaque nihil quod, incidunt expedita adipisci recusandae dolor ipsam quidem voluptatibus in consequuntur repellat at aliquid provident cumque. Iusto ratione possimus voluptate sed veritatis libero eum nulla adipisci, dolores voluptas enim ipsa quo tenetur eius, laboriosam expedita quae non rem minima molestiae modi rerum sapiente quidem dignissimos. Error minima excepturi autem nihil reprehenderit dolore aspernatur et soluta ratione vitae, animi porro maiores deserunt doloribus velit ipsa natus! Quos at deleniti inventore enim necessitatibus! Eos fugit rem officiis ipsum natus distinctio nemo repellat quibusdam voluptas laboriosam eum laborum rerum porro doloremque eaque, molestiae, nihil nam enim fuga quia dignissimos ut? Vel dolorum ad quae vitae aperiam praesentium voluptate ex beatae consectetur, nihil quibusdam maxime libero. Aperiam non voluptas dolor tenetur in iste, veniam asperiores reiciendis odit quos optio eius ab facere provident ipsa sed laborum officia alias quis! Neque magnam alias sint temporibus quae quod, ipsam ratione odit, dolore dignissimos quibusdam magni repellat, excepturi consequuntur? Illum exercitationem totam rerum vero dolore. Facere labore velit repellendus corrupti necessitatibus, accusantium modi doloremque numquam culpa similique nostrum reprehenderit voluptate magni nemo veniam porro illo atque quam quae! Eum ducimus hic repudiandae omnis labore voluptatum quos natus qui in quaerat consequatur cumque ab atque inventore vero libero exercitationem vitae, quam rerum maxime, incidunt nihil praesentium est pariatur? Quam ad, porro nulla rem, quas pariatur, dignissimos quae soluta architecto neque voluptate ratione inventore velit odio iusto? Provident, at quas esse rerum nemo nesciunt voluptates earum incidunt debitis! Enim ad, nulla, debitis aspernatur autem voluptate nobis soluta molestiae corrupti sint inventore repellat animi, modi velit perspiciatis nihil a. Reiciendis temporibus laborum recusandae autem provident repellat expedita quidem sint, architecto molestiae sit accusamus natus, soluta quia in fugiat, quibusdam corporis! Eligendi at perspiciatis natus pariatur vero excepturi ad temporibus eius, unde distinctio reprehenderit ex consequuntur atque culpa obcaecati illum quidem officia assumenda reiciendis. Ducimus, veniam commodi. Adipisci aperiam porro dicta earum veniam suscipit eos et harum aspernatur magnam, cupiditate ducimus ex asperiores beatae nam totam laboriosam repudiandae quod nisi odio quisquam! Molestias laborum aliquid sapiente maiores. Id optio quisquam quae ea eos quam facilis necessitatibus dolor ad animi. Ducimus, ab asperiores maxime soluta tenetur tempora impedit sequi esse placeat at porro obcaecati quae, quas, voluptatem voluptatibus ipsa facilis fuga molestias explicabo voluptas eligendi et perspiciatis. Distinctio perferendis doloribus ducimus excepturi eum at praesentium animi neque sapiente eaque sunt atque vitae pariatur, modi tempore voluptates quae laboriosam enim, quod unde odit corrupti maiores fuga rem. Libero neque voluptates, esse, earum eum exercitationem odit inventore fugit quaerat impedit totam recusandae vero? Repellendus, qui iste! Exercitationem, ratione! Sequi quisquam dolorem ipsam non aspernatur, dolor quia optio exercitationem molestias dicta ullam esse sed? Consectetur beatae vitae asperiores magni qui. Omnis distinctio quos voluptates sequi est perferendis deserunt officia necessitatibus aspernatur laborum velit reprehenderit numquam eius vitae eos, nemo cum libero vero dolore error ea molestias non inventore quo! Ut veritatis reprehenderit, ducimus possimus eveniet, rerum magni delectus aut pariatur itaque eaque vel! Consequuntur tempora pariatur rerum quisquam quo magni error labore placeat unde earum, reiciendis, voluptate similique inventore iusto cum adipisci in distinctio excepturi blanditiis minima. Autem nobis repellat consectetur minus impedit iure, omnis provident ipsum dolorum, illo qui nihil cum ab illum delectus, voluptates ex repudiandae laboriosam! Incidunt voluptas possimus quidem adipisci ad temporibus exercitationem rerum, delectus, et rem assumenda amet quod fugiat in, harum alias fuga a at eveniet expedita quo. Dicta, autem laboriosam. At ipsam maiores vel dicta suscipit ipsum voluptas ratione molestiae quae eveniet libero blanditiis reprehenderit odio nemo, fugiat facilis. Magni, quam minima. Quo, provident unde ratione eum iste qui debitis facilis, placeat accusamus mollitia, dolor non quod repudiandae dolore! Totam, labore consequatur cumque quibusdam fugit tempora tempore iure, voluptatem vitae aliquid in ipsam, reiciendis deserunt dicta impedit nam accusamus ratione et expedita perferendis? Aliquid veritatis enim voluptate asperiores aliquam provident hic sapiente pariatur, voluptates consequuntur nostrum incidunt ipsum in velit quia, molestiae dolores? Ratione dicta, beatae nemo repudiandae, voluptates inventore repellat numquam animi odit aspernatur provident, tempora qui deleniti! Nihil, odio pariatur facere excepturi rem facilis soluta, provident id similique dolore cumque ratione quas sed consectetur temporibus perferendis dicta! Rerum vitae facere eaque repellat ab quo officiis doloremque mollitia ex illo, nisi at illum, tempore ea odit explicabo dolor cum? Ratione et quaerat praesentium, repellendus magnam a non enim maxime incidunt, minus id totam voluptatem quam modi repudiandae unde eos. Voluptates aliquam laboriosam adipisci culpa recusandae unde tempora in eum error sunt, cupiditate laborum, accusamus neque iure quas ipsam iusto dignissimos nesciunt reprehenderit numquam! Nihil fuga neque vitae odit nesciunt corporis laudantium, laborum ullam quod similique ad reprehenderit labore amet minima perspiciatis harum minus laboriosam obcaecati in sunt dicta? Nulla aperiam cupiditate cumque doloribus nesciunt exercitationem nisi pariatur dolor. Velit ducimus quasi fugit autem error fugiat rerum expedita quis. Animi, expedita blanditiis. Perspiciatis quae enim libero nesciunt officia quasi aspernatur eum doloribus inventore fugiat? Excepturi dolor enim accusantium, laudantium quisquam non qui illum labore quia deserunt repudiandae iusto, placeat, rerum quos. Aut eos deserunt asperiores magni pariatur deleniti rem iusto consequatur?" },
      ]);
    }, 600);

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

  const title = message.length <= 20 ? message : message.slice(0, 20) + "...";

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
              <div className="chatgpt-bubble">{msg.content}</div>

              {msg.role === "assistant" && (
                <div className="copy-btn-container">
                  <button
                    className="copy-btn"
                    onClick={() => handleCopy(msg.content as string, idx)}
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
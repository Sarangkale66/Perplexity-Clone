import { Mic } from "lucide-react";
import React, { useEffect, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "./SpeechToTextButton.css";

interface Props {
  textRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  language?: string;
}

const SpeechToTextButton: React.FC<Props> = ({ textRef, language = "en-US" }) => {
  const { transcript, listening, finalTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const audioStart = useRef(new Audio("/sound/clicked.mp3"));
  const audioStop = useRef(new Audio("/sound/clickedStop.mp3"));
  const lastTranscript = useRef({ value: "" });
  const wasListening = useRef(false);

  useEffect(() => {
    if (textRef.current && transcript) {
      textRef.current.value = (lastTranscript.current.value.trimEnd() + " " + transcript).trim();
    }
  }, [transcript, textRef]);


  useEffect(() => {
    if (wasListening.current && !listening) {
      audioStop.current.play();
      if (textRef.current) textRef.current.value = lastTranscript.current.value.trimEnd() + " " + finalTranscript;
    }
    wasListening.current = listening;
  }, [listening]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser does not support speech recognition.</span>;
  }

  const handleClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      audioStart.current.play();
      lastTranscript.current.value = textRef.current?.value || "";
      SpeechRecognition.startListening({
        continuous: false,
        language,
      });
    }
  };

  return (
    <div>
      <button onClick={handleClick}>
        <div className={`enter ${listening ? "listening" : ""}`}>
          <Mic size={18} />
        </div>
      </button>
    </div>
  );
};

export default SpeechToTextButton;
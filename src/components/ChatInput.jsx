import React, { useState } from "react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import supabase from "../config/supabaseClients";

function ChatInput({ handleTyping, handleMessage, messages, setMessages }) {
  const [m, setM] = useState("");

 
  const handleChange = (e) => {
    setM(e.target.value);
    handleTyping();

   
    const textarea = e.target;
    textarea.style.height = 'auto'; 
    textarea.style.height = `${textarea.scrollHeight}px`; 
  };

  return (
    <>
      <div className="relative w-full">
        <textarea
          value={m}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleMessage(e.currentTarget.value);
              e.currentTarget.value = "";
              setM("");
            }
          }}
          placeholder="Enter the text"
          className="bg-transparent border-2 border-gray-700 rounded-sm text-white w-full px-2 py-2 
            focus:border-cyan-400 focus:outline-none resize-none overflow-hidden"
          rows={0} // Start with 1 row of height
        ></textarea>

        <button
          type="submit"
          onClick={(e) => {
            console.log(m);
            handleMessage(m);
            setM("");
          }}
          className="absolute top-0 right-0 p-2.5 h-full text-sm font-medium text-white"
        >
          <svg
            className="h-6 w-6 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </>
  );
}

export default ChatInput;

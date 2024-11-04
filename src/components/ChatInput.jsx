import React from "react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
function ChatInput({ handleMessage }) {
  return (
    <>
      <div className="relative w-full">
        <input
          type="text"
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              handleMessage(e.currentTarget.value);
              e.currentTarget.value = "";
            }
          }}
          placeholder="Enter the text"
          className="bg-transparent border-2 border-gray-700 rounded-sm text-white w-full h-10 px-2 
            focus:border-cyan-400 focus:outline-none"
        ></input>
        <button
          type="submit"
          class="absolute top-0 end-0 p-2.5 h-full text-sm font-medium text-white       "
        >
          <svg
            class="h-6 w-6 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            {" "}
            <line x1="22" y1="2" x2="11" y2="13" />{" "}
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </>
  );
}

export default ChatInput;

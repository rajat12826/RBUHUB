import React, { useEffect, useState, useRef } from "react";
import supabase from "../config/supabaseClients";
import ChatCard from "./ChatCard";
import Loader from "./Loader";
import MessageLoad from "./MessageLoad";

function ListMessages({
  typingStatus,
  setTypingStatus,
  setcurrentU,
  setOnlineUserCount,
  addMessage,
  messages,
  setMessages,
  user,
  open,
  setOpen,
  onDelete,
  handleDelete,
  reply,
  setReplyM,
}) {
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const messageRef = useRef({});

  useEffect(() => {
    // Fetch existing messages when component mounts
    const fetchMessages = async () => {
      const { data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .is("room_id", null); // Fetch messages with null room_id

      if (error) {
        console.error("Error fetching messages:", error.message);
        return;
      }

      const messagesWithUsers = await Promise.all(
        messages.map(async (message) => {
          const { data: user, error: userError } = await supabase
            .from("User")
            .select("*")
            .eq("user_id", message.send_by)
            .single();

          if (userError) {
            console.error("Error fetching user:", userError.message);
            return { ...message, user: null };
          }

          return { ...message, user };
        })
      );

      setMessages(messagesWithUsers);
      setLoading(false);
    };

    fetchMessages();

    // Set up real-time subscription to the messages table
    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            const newMessage = payload.new;

            // Fetch the user associated with the new message
            const { data: user, error: userError } = await supabase
              .from("User")
              .select("*")
              .eq("user_id", newMessage.send_by)
              .single();

            if (userError) {
              console.error("Error fetching user for new message:", userError.message);
            }

            const messageWithUser = { ...newMessage, user };

            // Update state with the new message
            setMessages((prevMessages) => [...prevMessages, messageWithUser]);
          } else if (payload.eventType === "UPDATE") {
            const updatedMessage = payload.new;

            // Fetch the updated user information
            const { data: user, error: userError } = await supabase
              .from("User")
              .select("*")
              .eq("user_id", updatedMessage.send_by)
              .single();

            if (userError) {
              console.error("Error fetching user for updated message:", userError.message);
            }

            const messageWithUser = { ...updatedMessage, user };

            // Update the message in the state
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.id === messageWithUser.id ? messageWithUser : msg
              )
            );
          } else if (payload.eventType === "DELETE") {
            setMessages((prevMessages) =>
              prevMessages.filter((msg) => msg.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // Cleanup the channel when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [setMessages]);


  useEffect(() => {
    
    const onlineU = supabase
      .channel("public:online_users")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "online_users" }, // event filter
        async (payload) => {
          // console.log(payload, "fr");

         
          const { new: newTypingStatus, old: oldTypingStatus } = payload;

         
          if (payload.event === "INSERT" && newTypingStatus.room_id==null) {
            setOnlineUserCount((prev) => prev + 1); // Increment user count
          }

          
          if (payload.event === "DELETE" && oldTypingStatus) {
            setOnlineUserCount((prev) => prev - 1); // Decrement user count
          }
        }
      )
      .subscribe();

    return () => {
      onlineU.unsubscribe();
    };
  }, []);
  useEffect(() => {
    const fetchOnlineUserCount = async () => {
      const { data, count, error } = await supabase
        .from("online_users")
        .select("*", { count: "exact" })
        .eq("status", "online")
        .is("room_id",null)

      setcurrentU(data);

      if (error) {
        console.error("Error fetching online user count:", error.message);
      } else {
        setOnlineUserCount(count);
      }
    };

    fetchOnlineUserCount();

    const channel = supabase
      .channel("public:online_users")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "online_users" },
        () => {
          fetchOnlineUserCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [setcurrentU, setOnlineUserCount]);

  useEffect(() => {
    // Scroll to the bottom when messages update
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      {Object.keys(typingStatus).length ? (
        <div className="border-2 px-10 py-3 text-sm text-slate-400 border-[#00b0ff] rounded-lg shadow-[#00b0ff] shadow-md"  onKeyDown={(e) => {
          if (e.ctrlKey && (e.key === 'p')) {
         console.log("enedj");
         
          }
        }}>
          {Object.keys(typingStatus)
            .slice(0, 1)
            .map((userId) =>
              typingStatus[userId] ? (
                <div className="flex" key={userId}>
                  <p>{typingStatus[userId]} is typing</p>
                  <div className="flex space-x-2 justify-center items-center bg-[#100f18]">
                    <div className="h-1 w-1 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s] ml-2"></div>
                    <div className="h-1 w-1 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-1 w-1 bg-slate-400 rounded-full animate-bounce"></div>
                  </div>
                </div>
              ) : null
            )}
        </div>
      ) : null}

      {!loading ? (
        <div className="f">
          {messages.map((message) => (
            <ChatCard
              key={message.id}
              allMessage={messages}
              addMessage={addMessage}
              message={message.text}
              setMessages={setMessages}
              sender={message.user ? message.user.username : "Unknown"}
              sendAt={message.created_at}
              user={user}
              id={message.user ? message.user.user_id : null}
              messages={message}
              open={open}
              setOpen={setOpen}
              reply={reply}
              setReplyM={setReplyM}
              messageRef={messageRef}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <MessageLoad />
      )}
    </>
  );
}

export default ListMessages;

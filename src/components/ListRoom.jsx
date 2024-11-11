import React, { useEffect, useState, useRef } from "react";
import supabase from "../config/supabaseClients";
import ChatCard from "./ChatCard";
import Loader from "./Loader";
import MessageLoad from "./MessageLoad";

function ListRoom({
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
  roomId
}) {
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
useEffect(() => {
    const onlineU = supabase
      .channel("public:online_users")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "online_users" }, 
        async (payload) => {
          const { new: newTypingStatus, old: oldTypingStatus } = payload;
  
          if (payload.eventType === "INSERT" || (payload.eventType === "UPDATE" && newTypingStatus?.room_id)) {
           
            if (!currentU || currentU.length <= 0 || !currentU.some((user) => user.user_id === newTypingStatus.user_id)) {
              setcurrentU((prev) => {
                const currentArray = Array.isArray(prev) ? prev : []; 
                return [...currentArray, newTypingStatus]; 
              });
              setOnlineUserCount((prev) => prev + 1); 
            }
          }
  
         
          if (payload.event === "DELETE" && oldTypingStatus) {
            setcurrentU((prev) => prev.filter((user) => user.user_id !== oldTypingStatus.user_id));
            setOnlineUserCount((prev) => prev - 1); 
          }
        }
      )
      .subscribe();
  
    return () => {
      onlineU.unsubscribe();
    };
  }, []); 
  useEffect(() => {
    const fetchMessages = async () => {
 
      const { data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .eq("room_id", roomId);

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

   
    const channel = supabase
      .channel(`public:messages:room_${roomId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages", filter: `room_id=eq.${roomId}` },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            const newMessage = payload.new;

            const { data: user, error: userError } = await supabase
              .from("User")
              .select("*")
              .eq("user_id", newMessage.send_by)
              .single();

            if (userError) {
              console.error("Error fetching user for new message:", userError.message);
            }

            const messageWithUser = { ...newMessage, user };
            setMessages((prevMessages) => [...prevMessages, messageWithUser]);
          } else if (payload.eventType === "UPDATE") {
            const updatedMessage = payload.new;

            const { data: user, error: userError } = await supabase
              .from("User")
              .select("*")
              .eq("user_id", updatedMessage.send_by)
              .single();

            if (userError) {
              console.error("Error fetching user for updated message:", userError.message);
            }

            const messageWithUser = { ...updatedMessage, user };
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

   
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, setMessages]); 

  useEffect(() => {
    const fetchOnlineUserCount = async () => {
      const { data, count, error } = await supabase
        .from("online_users")
        .select("*")
        // .eq("status", "online")
        .eq("room_id",roomId)
// console.log(data)

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
 
    if (messagesEndRef?.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      {Object.keys(typingStatus).length ? (
        <div className="border-2 px-10 py-3 text-sm text-slate-400 border-[#00b0ff] rounded-lg shadow-[#00b0ff] shadow-md">
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

export default ListRoom;

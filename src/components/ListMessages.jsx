import React, { useEffect, useState, useRef } from "react";
import supabase from "../config/supabaseClients";
import ChatCard from "./ChatCard";
import Loader from "./Loader";
import MessageLoad from "./MessageLoad";

function ListMessages({ setcurrentU,setOnlineUserCount, addMessage, messages, setMessages, user, open, setOpen, onDelete, handleDelete }) {
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null); // Create a ref for the messages container

  useEffect(() => {
    const fetchMessages = async () => {
      const { data: messages, error } = await supabase.from("messages").select("*");

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
      .channel("public:messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, async (payload) => {
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
            prevMessages.map((msg) => (msg.id === messageWithUser.id ? messageWithUser : msg))
          );
        } else if (payload.eventType === "DELETE") {
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.id !== payload.old.id)
          );
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const fetchOnlineUserCount = async () => {
      const { data, count, error } = await supabase
        .from("online_users")
        .select('*', { count: 'exact' })  
        .eq('status', 'online'); 
console.log("fetch",data)
setcurrentU(data)
console.log(data);

      if (error) {
        console.error("Error fetching online user count:", error.message);
      } else {
        console.log("count", count);
        setOnlineUserCount(count);
      }
    };

    fetchOnlineUserCount();

    const channel = supabase
      .channel('public:online_users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'online_users' }, () => {
        fetchOnlineUserCount(); 
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Runs when messages change

  return (
    <>
      {!loading ? (
        <div>
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
            />
          ))}
          <div ref={messagesEndRef} /> {/* This is where we scroll to */}
        </div>
      ) : (
        <MessageLoad />
      )}
    </>
  );
}

export default ListMessages;

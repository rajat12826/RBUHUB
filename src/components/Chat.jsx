import React, { useEffect, useState } from "react";
import ChatInput from "./ChatInput";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import supabase from "../config/supabaseClients";
import ListMessages from "./ListMessages";
import { v4 as uuidv4 } from "uuid";
import Loader from "./Loader";

import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
function Chat({ user }) {
  const [onlineUserCount, setOnlineUserCount] = useState(0);
  const [messages, setMessages] = useState([]);
  console.log(user?.user, "d");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentU, setcurrentU] = useState([]);
  const [typingStatus, setTypingStatus] = useState({});
  console.log(currentU);
  console.log(typingStatus);
  const [us, setUs] = useState("");
  useEffect(() => {
    const typingChannel = supabase
      .channel("public:typing_status")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "typing_status" },
        async (payload) => {
          const { new: newTypingStatus, old: oldTypingStatus } = payload;

          console.log("Payload received:", payload);

          if (payload.eventType === "INSERT" && payload.new.username) {
            const username = payload.new.username;
            if (payload.new.typing) {
              console.log(`${username} is typing`);
              setTypingStatus((prev) => ({
                ...prev,
                [payload.new.id]: username,
              }));
            }
          }

          if (payload.eventType === "DELETE" && payload.old) {
            // const userId = payload.old.user;

            // const { data: userData, error: userError } = await supabase
            //   .from("User")
            //   .select("username")
            //   .eq("user_id", userId)
            //   .single();

            // if (userError) {
            //   console.error("Error fetching user data for DELETE event:", userError);
            //   return;
            // }

            // if (userData?.username) {
            // console.log(`${userData.username} stopped typing`);
            setTypingStatus((prev) => {
              const newState = { ...prev };
              delete newState[payload.old.id];
              return newState;
            });
            // }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(typingChannel);
    };
  }, []);

  // useEffect(async() => {

  //   const { data: userData, error: userError } =  await supabase
  //   .from("User")
  //   .select("username")
  //   .eq("user_id", user?.user.id)
  //   .single();
  //   setTimeout(async () => {
  //     // await supabase.from("typing_status").delete().eq("user", user.user.id);
  //     setTypingStatus((prev) => {
  //       const updatedStatus = { ...prev };
  //       if(updatedStatus[userData.username]){
  //       delete updatedStatus[userData.username];}
  //       return updatedStatus;
  //     });
  //   }, 5000);
  // }, []);
  const handleTyping = async () => {
    const { data: userData, error: userError } = await supabase
      .from("User")
      .select("username")
      .eq("user_id", user?.user.id)
      .single();

    if (!userData) {
      console.error("Error: User data not found");
      return;
    }

    console.log(userData.username);

    await supabase.from("typing_status").upsert([
      {
        user: user.user.id,
        typing: true,
        last_updated: new Date(),
        username: userData.username,
      },
    ]);

    setTimeout(async () => {
      await supabase.from("typing_status").delete().eq("user", user.user.id);

      setTypingStatus((prev) => {
        const updatedStatus = { ...prev };
        delete updatedStatus[userData.username];
        return updatedStatus;
      });
    }, 5000);
  };

  useEffect(() => {
    if (messages) {
      setLoading(false);
    }
  }, []);
  const handleMessage = async (text) => {
    if (!text.trim()) {
      toast.error("Empty Messages Not Allowed!!");
      return;
    }
    const { data: userData, error: userError } = await await supabase
      .from("User")
      .select("username")
      .eq("user_id", user?.user.id)
      .single();
    console.log(userData);

    const newMessage = {
      id: uuidv4(),
      text,
      send_by: user?.user.id,
      is_edit: false,
      sender_name: userData?.username,
      created_at: new Date().toISOString(),
      replyto_id: reply && reply.id ? reply.id : null,
      reply_to: {
        username: reply && reply.sender ? reply.sender : null,
        text: reply && reply.message ? reply.message : null,
        time: reply && reply.time ? reply.time : null,
      },
    };
    setReplyM({});
    const { data, error } = await supabase.from("messages").insert(newMessage);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Message sent!");
    }
  };

  const onDelete = (id) => {
    setMessages((prev) => prev.filter((sm) => sm.id !== id));
  };
  const handleDelete = async (id) => {
    const { data, error } = await supabase
      .from("messages")
      .delete()
      .eq("id", id)
      .select();
    if (error) {
      toast.error("Unable To Find You Message!!!!");
      return;
    }
    if (data) {
      toast.success(" Message Deleted Successfully!!!!");
      onDelete(id);
    }
  };
  const [reply, setReplyM] = useState({});
  return (
    <>
      {!loading ? (
        <div className="bg-[#100f18] h-full flex flex-col">
          <div className="flex-grow overflow-auto">
            <nav className="flex justify-between p-4">
              <div className="text-red-500">
                <h1 className="font-semibold text-xl">Daily Chat</h1>
                <div className="flex items-center pl-5">
                  <h1 className="bg-green-500 h-4 w-4 rounded-full"></h1>

                  <Menu>
                    <MenuHandler>
                      <Button className="bg-[#100f18]">
                        <h1 className=" text-sm text-gray-500">
                          {onlineUserCount} online
                        </h1>
                      </Button>
                    </MenuHandler>
                    <MenuList className="ml-10">
                      <h1 className="flex justify-center font-bold cursor-default">
                        Online Users
                      </h1>
                      {currentU.map((user) => (
                        <MenuItem
                          key={user.id}
                          className="font-semibold flex  items-center justify-center hover:bg-gray-200 "
                        >
                          <img
                            src={user.avatar}
                            className="h-8 w-8 items-center "
                          ></img>
                          <h1 className="flex justify-center items-center pl-1">
                            {" "}
                            {user.username}
                          </h1>
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                </div>
              </div>
            </nav>
            <div className="bg-gray-800 w-full h-[1px]"></div>

            <div className="p-4">
              <ListMessages
                messages={messages}
                setMessages={setMessages}
                user={user}
                open={open}
                setOpen={setOpen}
                onDelete={onDelete}
                handleDelete={handleDelete}
                addMessage={handleMessage}
                setOnlineUserCount={setOnlineUserCount}
                setcurrentU={setcurrentU}
                reply={reply}
                setReplyM={setReplyM}
                typingStatus={typingStatus}
                setTypingStatus={setTypingStatus}
              />
            </div>
          </div>

          <div className="p-4">
            <ChatInput
              messages={messages}
              handleTyping={handleTyping}
              setMessages={setMessages}
              handleMessage={handleMessage}
              reply={reply}
              setReplyM={setReplyM}
            />
          </div>
        </div>
      ) : (
        <Loader />
      )}
      <Toaster />
    </>
  );
}

export default Chat;

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
  console.log(user?.user);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentU, setcurrentU] = useState([]);
  
  console.log(currentU);

  useEffect(() => {
    if (messages) {
      setLoading(false);
    }
  });
  const handleMessage = async (text) => {
    if (!text.trim()) {
      toast.error("Empty Messages Not Allowed!!");
      return;
    }

    const newMessage = {
      id: uuidv4(),
      text,
      send_by: user?.user.id,
      is_edit: false,
      created_at: new Date().toISOString(),
      user: {
        id: user?.user.id,
        created_at: user?.user.created_at,
        email: user?.user.email,
      },
    };

    const { data, error } = await supabase.from("messages").insert({ text });

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
                      <Button>
                        <h1 className=" text-sm text-gray-500">
                          {onlineUserCount} online
                        </h1>
                      </Button>
                    </MenuHandler>
                    <MenuList className="ml-10">
                      <h1 className="flex justify-center font-bold cursor-default">Online Users</h1>
                      {
                        currentU.map((user) => (
                          <MenuItem key={user.id} className="font-semibold flex  items-center justify-center hover:bg-gray-200 ">
                            <img src={user.avatar} className="h-8 w-8 items-center "></img>
                          <h1 className="flex justify-center items-center pl-1">  {user.username}</h1>
                          </MenuItem>
                        ))
                      }
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
              />
            </div>
          </div>

          <div className="p-4">
            <ChatInput handleMessage={handleMessage} />
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

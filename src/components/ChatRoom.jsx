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
import { useNavigate, useParams } from "react-router-dom";
import ListRoom from "./ListRoom";
function ChatRoom({ user }) {
  const { roomId } = useParams();
  const [onlineUserCount, setOnlineUserCount] = useState(0);
  const [messages, setMessages] = useState([]);
 
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentU, setcurrentU] = useState([]);
  const [typingStatus, setTypingStatus] = useState({});
  const [rooms, setRooms] = useState([]);
  const [us, setUs] = useState("");
  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase.from("rooms").select("*");
  // console.log(data);
  
      if (error) {
        toast.error("Failed to fetch rooms.");
        console.error(error);
        return;
      }
  
      setRooms(data);
    };
  // console.log(rooms);
  
    fetchRooms();
  }, []);
  // console.log(rooms);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: data1, error: error1 } = await supabase
          .from("User")
          .select("*")
          .eq("user_id", user?.user.id)
          .single();

        if (error1) {
          console.error("Error fetching user data:", error1);
          return;
        }

       
        const { data: existingUser, error: existingUserError } = await supabase
          .from("online_users")
          .select("*")
          .eq("user_id", user?.user.id)
          .is("room_id",roomId)
          .single();

        if (data1 && (existingUserError || !existingUser)) {
         
          const { error: onlineUserError } = await supabase
            .from("online_users")
            .upsert([
              {
                avatar: data1.avatar || "https://default-avatar-url.com",
                username: data1.username || "Anonymous",
                status: "online",
                room_id:roomId
              },
            ]);

          if (onlineUserError) {
            console.error(
              "Error inserting into online_users:",
              onlineUserError.message
            );
          }
        }
      } catch (err) {
        console.error("Error during user data fetch:", err);
      }
    };

    fetchUserData();
  }, []);
  const navigate = useNavigate();
  useEffect(() => {
    const typingChannel = supabase
      .channel("public:typing_status")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "typing_status" },
        async (payload) => {
          const { new: newTypingStatus, old: oldTypingStatus } = payload;

          if (payload.eventType === "INSERT" && payload.new.username) {
            const username = payload.new.username;
            if (payload.new.typing) {
              setTypingStatus((prev) => ({
                ...prev,
                [payload.new.id]: username,
              }));
            }
          }

          if (payload.eventType === "DELETE" && payload.old) {
            setTypingStatus((prev) => {
              const newState = { ...prev };
              delete newState[payload.old.id];
              return newState;
            });
          }
        }
      )
      .subscribe();

   
    return () => {
      if (typingChannel) {
        typingChannel.unsubscribe();
      }
    };
  }, []); 
 
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
    }, 2000);
  };
const handleCreateRoom = async () => {
  const roomName = prompt("Enter room name");
  if (!roomName) {
    toast.error("Room name is required.");
    return;
  }

  try {
    const { data, error } = await supabase
      .from("rooms")
      .insert([{ name: roomName, created_by: user?.user.id }])
      .single()
      .select();
// console.log(data);

    if (error) {
      toast.error("Failed to create room.");
      console.error(error);
      return;
    }

   
    await supabase.from("room_members").insert([
      { room_id: data.id, user_id: user?.user.id },
    ]);

    toast.success(`Room '${roomName}' created successfully!`);
  } catch (err) {
    console.error(err);
    toast.error("An error occurred while creating the room.");
  }
};

const handleJoinRoom = async (roomId) => {
 
  if (!roomId.trim()) {
    toast.error("Please enter a room ID to join!");
    return;
  }

  
  navigate(`/room/${roomId}`);
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
    const { data: userData, error: userError } =  await supabase
      .from("User")
      .select("username")
      .eq("user_id", user?.user.id)
      .single();
    

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
      room_id:roomId
    };
    setReplyM({});
    const { data, error } = await supabase.from("messages").insert(newMessage);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Message sent!");
    }
  };
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
            <nav className="flex justify-between p-4 font-product">
              <div className="text-red-50 ">
                <h1 className="font-semibold text-xl">Daily Chat</h1>
                <div className="flex items-center pl-5">
                  <h1 className="bg-green-500 h-4 w-4 rounded-full"></h1>

                  <Menu>
                    <MenuHandler>
                      <Button className="bg-[#100f18]">
                        <h1 className=" text-sm text-gray-500">
                          {currentU?.length} online
                        </h1>
                      </Button>
                    </MenuHandler>
                    <MenuList className="ml-10">
                      <h1 className="flex justify-center font-bold cursor-default">
                        Online Users
                      </h1>
                      {currentU?.map((user) => (
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
              <Menu>
                <MenuHandler className="mr-24 ">
                  <button className="text-slate-200 font-semibold hover:text-slate-400 mr-5">
                   <h1 className="text-slate-400 "> Rooms</h1>
                  </button>
                </MenuHandler>
                <MenuList className="ml-10 bg-gray-900 shadow-md shadow-[#03a9f4] border-[#03a9f4] border-2 font-product">
                  <MenuItem
                    
                    className=" flex  items-center justify-center hover:bg-text-800  "
                  >
                  <button className=" text-slate-300 font-semibold hover:text-slate-500 mr-5"   onClick={handleCreateRoom}><h1 className="font-semibold  "> Create A Room</h1></button>
                  </MenuItem>
                      <MenuItem
                    
                    className=" flex  items-center justify-center hover:bg-text-800 "
                  >
                  <button className=" text-slate-300 font-semibold hover:text-slate-500 mr-5"><h1 className="font-semibold " onClick={ handleJoinRoom}> Join  Rooms:</h1></button>
                  </MenuItem>
                <div className="ml-20">
                {rooms.map((room)=>{
                  return <MenuItem
  className="flex items-center justify-center text-gray-300 hover:text-slate-500 hover:bg-text-800"
  onClick={() => handleJoinRoom(room.id)}
>
  <h1 className="font-semibold">{room.name}</h1>
</MenuItem>
                  })}
                </div>
                  
                </MenuList>
              </Menu>
            </nav>
            <div className="bg-gray-800 w-full h-[1px]"></div>

            <div className="p-4">
              <ListRoom
              roomId={roomId}
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

export default ChatRoom;

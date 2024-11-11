import React, { useEffect, useRef, useState } from "react";
import supabase from "../config/supabaseClients";
import { v4 as uuidv4 } from "uuid";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import Modal from "./Modal";

function ChatCard({
  messageRef,
  addMessage,
  allMessage,
  messages,
  message,
  setMessages,
  sender,
  sendAt,
  user,
  id,
  open,
  setOpen,
  reply,
  setReplyM,
}) {
  useEffect(() => {
    if (reply && reply.id) {
      scrollToMessage(reply.id);
    }
  }, [reply]);

  const scrollToMessage = (id) => {
    if (messageRef.current[id]) {
      console.log(id);
      messageRef.current[id].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };
  console.log("mes", user);
  console.log(messages);
  const [up, setUp] = useState(id === user?.user.id);
  let u = JSON.parse(localStorage.getItem("user"));
  const [d, setD] = useState(messages.user?.created_at);
  const [update, setUpdate] = useState(false);
  const [profileopen, setprofileopen] = useState(false);
  const [upmess, setupmess] = useState(message);
  useEffect(() => {
    if (id === u?.user.id) {
      setUp(true);
    } else {
      setUp(false);
    }
  }, [addMessage]);

  const handleOpen = () => setOpen(!open);
  let id1 = id;
  const deleteFn = () => {
    console.log(id1);
    console.log(messages);
    const onDelete = (id) => {
      setMessages((prev) => prev.filter((sm) => sm.id !== id));
    };
    const handleDelete = async (id) => {
      console.log(id1, u.user.id);

      if (id1 === u?.user.id) {
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
          // console.log(data);
          toast.success(" Message Deleted Successfully!!!!");

          onDelete(id);
        }
      }
      setOpen(false);
    };

    handleDelete(messages.id);
  };
  const updateFn = () => {
    const onUpdate = (id) => {
      const updatedMessages = allMessage.map((mes) =>
        mes.id === id
          ? { ...mes, text: upmess, created_at: new Date().toISOString() }
          : mes
      );

      setMessages(updatedMessages);
      console.log(allMessage);
    };
    const handleUpdate = async (id) => {
      if (id1 === u?.user.id) {
        const { data, error } = await supabase
          .from("messages")
          .update({ text: upmess, created_at: new Date().toISOString() })
          .eq("id", id)
          .select();
        console.log(data);
        if (error) {
          toast.error("Unable To Find You Message!!!!");
          return;
        }
        if (data) {
          toast.success(" Message Updated Successfully!!!!");

          onUpdate(id);
        }
      }
      setUpdate(false);
      setupmess(message);
    };

    handleUpdate(messages.id);
  };
  const date = new Date(sendAt);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  const handleReply = (id) => {
    console.log(reply);

    if (reply.id) {
      setReplyM({});
    } else {
      setReplyM({
        sender: sender?.substring(0, 15),
        message: message,
        time: date.toLocaleString("en-IN", options),
        id: messages.id,
      });
      console.log(reply, "hi");
      scrollToMessage(id);
    }
  };
  return (
    <>
      <div
        ref={(el) => {
          messageRef.current[messages.id] = el;
        }}
        className={`${true ? " flex w-full justify-end " : null} ${
          reply?.id && messages.id == reply.id
            ? " border-2 border-cyan-300 rounded-lg shadow-md shadow-cyan-400   "
            : null
        }   `}
      >
        <div className={`  flex px-10 ${up?" px-10": " px-3 "}  py-5 w-full items-start space-x-4 max-sm:space-x-0`}>
        <div
            className={` flex ${up ? " hidden   " : null}  cursor-pointer `}
            onClick={() => setprofileopen(true)}
          >
            <img
              src={
                messages.user
                  ? messages.user?.avatar
                  : "https://pbs.twimg.com/media/D0oEaNJWwAASCwt?format=jpg&name=small"
              }
              className="w-12 h-12 rounded-full object-cover"
              alt="User avatar"
            />
          </div>
          <Modal open={profileopen} onClose={() => setprofileopen(false)}>
            <div className="text-center w-56 ">
              <div className="flex justify-center ">
                <div className="">
                  <img
                    src={
                      messages.user
                        ? messages.user?.avatar
                        : "https://pbs.twimg.com/media/D0oEaNJWwAASCwt?format=jpg&name=small"
                    }
                    className="w-12 h-12 rounded-full object-cover"
                    alt="User avatar"
                  />
                </div>
              </div>
              <div className="mx-auto my-4 w-48">
                
                <h3 className="text-lg font-black text-gray-800">
                  {sender?.substring(0, 15)}
                </h3>
                <p className="text-sm text-gray-500 ">
                  User From:{" "}
                  {new Date(messages.user?.created_at).toLocaleString(
                    "en-IN",
                    options
                  )}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  className="btn btn-light w-full text-red-500 py-1 font-semibold hover:bg-red-100 hover:rounded-sm"
                  onClick={() => setprofileopen(false)}
                >
                  Back
                </button>
              </div>
            </div>
          </Modal>
          <div className="flex-1">
            <div className={`flex ${up ? "justify-end" : ""} items-center`}>
              {messages.replyto_id ? (
                <div>
                  <div
                    className="border-2 border-green-400  shadow-green-800 shadow-md cursor-pointer hover:shadow-green-400   border-gray-800 px-5 py-2 rounded-lg"
                    onClick={() => scrollToMessage(messages.replyto_id)}
                  >
                    <h1 className="text-white ">
                      Replied To:{" "}
                      <span className="text-gray-300">
                        {messages.reply_to?.username}
                      </span>
                      <span className="text-sm text-gray-400 ml-2 sm:ml-4 max-sm:block max-sm:mt-1 max-sm:text-xs">
                        {messages.reply_to?.time}
                      </span>
                    </h1>
                    <div className="text-gray-400">
                      {messages.reply_to?.text}
                    </div>
                  </div>
                  {messages.replyto_id ? (
                    <div className={`${up ? "  " : " "}`}>
                      <svg
                        class="h-8 w-8 text-green-300  "
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        {" "}
                        <polyline points="15 14 20 9 15 4" />{" "}
                        <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
                      </svg>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
            <div>
              <div
                className={`flex ${
                  up ? " justify-end  max-sm " : null
                } items-center  `}
              >
                 <div
            className={` flex ${up ? " md:hidden   mr-2" : " hidden"}  cursor-pointer `}
            onClick={() => setprofileopen(true)}
          >
            <img
              src={
                messages.user
                  ? messages.user?.avatar
                  : "https://pbs.twimg.com/media/D0oEaNJWwAASCwt?format=jpg&name=small"
              }
              className="w-12 h-12 rounded-full object-cover"
              alt="User avatar"
            />
          </div>
                <h1 className="text-white font-semibold text-sm">
                  {sender?.substring(0, 15)}
                </h1>
                <div>
                  <h1 className="text-zinc-400   pl-2 max-sm:text-sm ">
                    {date.toLocaleString("en-IN", options)}
                  </h1>
                </div>
                {!up ? (
                  <div
                    className="cursor-pointer "
                    onClick={() => handleReply(messages.id)}
                  >
                    <svg
                      class="h-5 w-8 text-blue-400 hover:text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                      />
                    </svg>
                  </div>
                ) : null}
                {up ? (
                  <div>
                    <div className="flex items-center pl-4 max-sm:p-0 visible">
                      <div
                        className={` max-md:hidden flex ${up ? "   " : null} cursor-pointer `}
                        onClick={() => setprofileopen(true)}
                      >
                        <img
                          src={
                            messages.user
                              ? messages.user?.avatar
                              : "https://pbs.twimg.com/media/D0oEaNJWwAASCwt?format=jpg&name=small"
                          }
                          className="w-12 h-12 rounded-full object-cover"
                          alt="User avatar"
                        />
                      </div>

                      <div className={`${open ? " pr-10 " : null} `}>
                        <Menu className="w-full">
                          <MenuHandler>
                            <Button className="flex items-center bg-gray-800 hover:bg-gray-700 p-2 rounded-full">
                              <svg
                                className="h-6 w-6 text-slate-100"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                />
                              </svg>
                            </Button>
                          </MenuHandler>

                          <div className="relative">
                            <MenuList className="bg-[#100f18] shadow-lg rounded-lg p-2 border-cyan-400 shadow-md shadow-blue-400 -ml-8">
                              <MenuItem className="px-4 py-2 text-slate-100 hover:bg-gray-700 rounded-lg ">
                                <Button
                                  onClick={() => setUpdate(true)}
                                  variant="gradient"
                                  className="bg-gray-800"
                                >
                                  Edit
                                </Button>
                              </MenuItem>
                              <MenuItem className="px-4 py-2 text-slate-100 hover:bg-gray-700 rounded-lg">
                                <Button onClick={handleOpen} variant="gradient">
                                  Delete
                                </Button>
                              </MenuItem>
                            </MenuList>
                          </div>
                        </Menu>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            <h1
              className={`flex ${
                up ? " justify-end mr-20 " : null
              } text-slate-400 text-sm`}
            >
              {message}
            </h1>
          </div>
          <Modal open={open} onClose={() => setOpen(false)}>
            <div className="text-center w-56">
              <div className="flex justify-center ">
                <svg
                  class="h-12 w-12 text-red-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  {" "}
                  <polyline points="3 6 5 6 21 6" />{" "}
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />{" "}
                  <line x1="10" y1="11" x2="10" y2="17" />{" "}
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </div>
              <div className="mx-auto my-4 w-48">
                <h3 className="text-lg font-black text-gray-800">
                  Confirm Delete
                </h3>
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this item?
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  className="btn btn-danger w-full bg-red-500 text-white py-1 rounded-sm hover:bg-transparent hover:text-red-500 hover:font-semibold shadow-red-500 shadow-sm"
                  onClick={()=>(deleteFn)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-light w-full text-red-500 font-semibold hover:bg-red-100 hover:rounded-sm "
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
          <Modal open={update} onClose={() => setUpdate(false)}>
            <div className="bg-white text-center w-72 mx-auto p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-black text-gray-800 mb-4">
                Confirm Edit
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to update this item?
              </p>
              <div className="pb-2 w-full">
                <textarea
                  value={upmess}
                  className="border-2 border-gray-300 w-full p-2 rounded-md resize-none"
                  onChange={(e) => setupmess(e.target.value)}
                  rows={4} // Adjust rows as needed
                />
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  className="w-full bg-green-500 text-white py-2 rounded-sm hover:bg-green-600 transition duration-200"
                  onClick={updateFn}
                >
                  Update
                </button>
                <button
                  className="w-full text-green-500 font-semibold hover:bg-green-100 py-2 rounded-sm transition duration-200"
                  onClick={() => {
                    setUpdate(false);
                    setupmess(message);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default ChatCard;

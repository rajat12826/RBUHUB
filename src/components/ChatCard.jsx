import React, { useEffect, useState } from "react";
import supabase from "../config/supabaseClients";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Dialog,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import Modal from "./Modal";

function ChatCard({ addMessage,allMessage,messages,message, setMessages,sender, sendAt, user, id,open,setOpen}) {
  // console.log(allMessage);
 
  
  const [up,setUp]=useState(id === user?.user.id)
  let u=JSON.parse(localStorage.getItem('user'))
;
  
 const [update, setUpdate] = useState(false); 
 const [upmess,setupmess]=useState(message)
useEffect(()=>{
  if(id === u?.user.id){
    setUp(true)
    // console.log('bye');
    
    }
    else{
      setUp(false)
    }

},[addMessage])

// console.log(up);




  const handleOpen = () => setOpen(!open);
  let id1=id
  const deleteFn=()=>{
    console.log(id1)
    console.log(messages);
    const onDelete = (id) => {
      setMessages((prev) => prev.filter((sm) => sm.id !== id));
    };
    const handleDelete = async (id) => {
      console.log(id1,u.user.id);
      
      if(id1 === u?.user.id){
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
      }}
    setOpen(false)
    };
   
    
    handleDelete(messages.id)
  }
  const updateFn=()=>{



    const onUpdate = (id) => {
     
      const updatedMessages = allMessage.map((mes) =>
        mes.id === id ? { ...mes, text: upmess,created_at: new Date().toISOString() } : mes
      );
  
    
      
      setMessages(updatedMessages)
      console.log(allMessage);
      
    };
    const handleUpdate = async (id) => {
      if(id1 === u?.user.id){
      const { data, error } = await supabase
        .from("messages")
        .update({ text: upmess,created_at: new Date().toISOString() })
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
      }}
    setUpdate(false)
    setupmess(message)
    };
  
    
    handleUpdate(messages.id)
  }
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

  return (
    <>
   
      <div className="flex px-10 py-5 w-full items-start space-x-4">
        <img
          src= {messages.user?messages.user?.avatar:"https://pbs.twimg.com/media/D0oEaNJWwAASCwt?format=jpg&name=small"}
          className="w-12 h-12 rounded-full object-cover"
          alt="User avatar"
        />

        <div className="flex-1">
          <div className="flex items-center">
            <h1 className="text-white font-semibold text-sm">
              {sender?.substring(0, 15)}
            </h1>
            <h1 className="text-zinc-400 pl-2 max-sm:text-sm ">
              {date.toLocaleString("en-IN", options)}
            </h1>
            {up ? (
              <div className="flex items-center pl-4 visible">
                <Menu>
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
                  <MenuList className="bg-[#100f18] shadow-lg rounded-lg p-2 border-cyan-400 shadow-md shadow-blue-400">
                    <MenuItem className="px-4 py-2 text-slate-100 hover:bg-gray-700 rounded-lg ">
                    <Button onClick={()=>(setUpdate(true))}  variant="gradient" className="bg-gray-800  ">
                      Edit
                      </Button>
                    </MenuItem>
                    <MenuItem className="px-4 py-2 text-slate-100 hover:bg-gray-700 rounded-lg">
                      <Button onClick={handleOpen} variant="gradient">
                       Delete
                      </Button>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </div>
            ):null}
          </div>
          <h1 className="text-slate-400 text-sm">{message}</h1>
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
                className="btn btn-danger w-full bg-red-500 text-white py-1 rounded-sm hover:bg-transparent hover:text-red-500 hover:font-semibold"
                onClick={deleteFn }
              >
                Delete
              </button>
              <button
                className="btn btn-light w-full text-red-500 font-semibold hover:bg-red-100 hover:rounded-sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
        <Modal open={update} onClose={() => setUpdate(false)}>
  <div className="bg-white text-center w-72 mx-auto p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-black text-gray-800 mb-4">Confirm Edit</h3>
    <p className="text-sm text-gray-500 mb-4">Are you sure you want to update this item?</p>
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
<Toaster/>
      
    </>
  );
}

export default ChatCard;

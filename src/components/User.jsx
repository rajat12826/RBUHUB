import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import supabase from "../config/supabaseClients";
import UserCard from "./UserCard";
import Modal from "./Modal";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
function User({
  users,
  setUsers,
  adminusers,
  setadminUsers,
  curr,
  setcurr,
  isAdmin,
  setIsAdmin,
  mainu,
  setmainu,
}) {
  //   const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [read, setread] = useState(false);
  const [write, setwrite] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [del, setdel] = useState(false);
  const [openadd, setOpenadd] = useState(false);
  const [opendel, setOpendel] = useState(false);
  const[fil,setfil]=useState(()=>("username"))
  console.log(fil);
  
  //   const [adminusers, setadminUsers] = useState([]);
  let u = JSON.parse(localStorage.getItem("user"));
  //   const [mainu, setmainu] = useState(null);
    const[isfiltered,setisfiltered]=useState(false)
  //   const[curr,setcurr]=useState(null)
  const [isActive, setIsActive] = useState(curr ? curr?.isAdmin : "false");
  //   const [isAdmin, setIsAdmin] = useState(curr?curr?.isAdmin :'false');
  const [username, setUsername] = useState(curr ? curr?.username : " ");
  const [email, setEmail] = useState(curr ? curr?.email : null);
  const[password,setpassword]=useState("")
  const[alluser,setalluser]=useState([...users,...adminusers])
//   console.log(curr);
  useEffect(() => {
    const fetchUsers = async () => {
       
      const { data, error } = await supabase
        .from("User")
        .select("*")
        .eq("isAdmin", false);

      if (data) setUsers(data);
      const { data: data1, error: error2 } = await supabase
        .from("User")
        .select("*")
        .eq("isAdmin", true);

      if (data1) setadminUsers(data1);
      const { data: data2, error: error1 } = await supabase
        .from("User")
        .select("*")
        .eq("user_id", u.user.id);
      if (data2) {
        setmainu(data2);
      }
    };

    const channel = supabase
      .channel("public:User")
      .on("postgres_changes", { event: "INSERT", table: "User" }, (payload) => {
        // console.log("User Inserted:", payload);

        setUsers((prevUsers) => [...prevUsers, payload.new]);
        fetchUsers();
      })
      .on("postgres_changes", { event: "UPDATE", table: "User" }, (payload) => {
        // console.log("User Updated:", payload.new.isAdmin);
        if (payload.new.isAdmin && isAdmin) {
          setadminUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === payload.new.id ? payload.new : user
            )
          );

        } else {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === payload.new.id ? payload.new : user
            )
          );
        }
        // console.log(users);
        fetchUsers();
      })
      .on("postgres_changes", { event: "DELETE", table: "User" }, (payload) => {
        // console.log("User Deleted:", payload);

        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== payload.old.id)
        );
        fetchUsers();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const searchF=()=>{
    if(searchQuery==""){
        toast.error("Search Field Cannot Be Empty")
        return
    }
    setalluser([...users,...adminusers])
    console.log(alluser);
    if (fil === "username") {
        setisfiltered(true)
      setFilteredUsers(
        alluser.filter(user =>
          (user.username.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      );
    } else if (fil === "email") {
        setisfiltered(true)
      setFilteredUsers(
        alluser.filter(user =>
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else if (fil === "status") {
        setisfiltered(true)
      setFilteredUsers(
        alluser.filter(user =>
          searchQuery.toLowerCase()=="active"?user.isActive:!user.isActive
        )
      );
    }
  }
//   console.log(isActive, isAdmin, username, email);
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("User")
        .select("*")
        .eq("isAdmin", false);

      if (data) setUsers(data);
      const { data: data1, error: error2 } = await supabase
        .from("User")
        .select("*")
        .eq("isAdmin", true);

      if (data1) setadminUsers(data1);
      const { data: data2, error: error1 } = await supabase
        .from("User")
        .select("*")
        .eq("user_id", u.user.id);
      if (data2) {
        setmainu(data2);
      }
    };
    fetchUsers();
  }, []);
  const addUsers = async () => {
    const { data:data2, error:error2 } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
    // console.log("ok");
    const generateAvatarUrl = (email) => {
        return `https://api.dicebear.com/9.x/bottts/svg?seed=${email}`;
      };
      if(curr.username==username && curr.isAdmin==isAdmin && curr.isActive==isActive && curr.email==email && curr.read==read && curr.write==write && curr.delete==del){
        toast.error("No Changes In Fields !!")
        return
    }
      
      const avatar = generateAvatarUrl(email);
    //   console.log(avatar);
    const { data, error } = await supabase
      .from("User")
      .upsert({
        user_id: data2.user.id,
        username: username,
        email: email,
        isActive: isActive,
        isAdmin: isAdmin,
        avatar,
        read,
        write,
        delete:del
      })
      .eq("user_id", curr?.user_id);
    // console.log(error, data);

    if (!error) {
      setcurr(null);
      setOpenadd(false);
     
      toast.success(`${username} is successfully added`);
      setEmail("");
      setUsername("");
      setIsActive(false);
  
      return;
    } else {
      setOpen(false);
      toast.error(`${username} is unable to add`);
    }
  };
  const updateUsers = async () => {
    console.log("ok");
    if(curr.username==username && curr.isAdmin==isAdmin && curr.isActive==isActive && curr.email==email && curr.read==read && curr.write==write && curr.delete==del){
        toast.error("No Changes In Fields !!")
        return
    }
    const { data, error } = await supabase
      .from("User")
      .update({
        username: username,
        email: email,
        isActive: isActive,
        isAdmin: isAdmin,
        read,
        write,
        delete:del
      })
      .eq("user_id", curr?.user_id);
    // console.log(error, data);

    if (!error) {
      setcurr(null);
      setOpen(false);
      // setIsActive(false)
      toast.success(`${username} is successfully updated`);
      setEmail("");
      setUsername("");
      setIsActive(false);
      // setIsAdmin(false)
      return;
    } else {
      setOpen(false);
      toast.error(`${username} is unable to update`);
    }
  };
  const deleteUser = async () => {
    // const { error: authError } =await supabase.auth.admin.deleteUser(curr?.user_id);
    const { data, error } = await supabase
      .from("User")
      .delete()
      .eq("user_id", curr?.user_id);
    //   if (authError) {
       
    //     toast.error(`${username} is unable to delete from authentication system`);
    //     setOpendel(false);
    //     return;
    //   }
    // console.log(error, data);
    if (!error) {
      setOpendel(false);
      // setIsActive(false)
      toast.success(`${username} is successfully deleted`);

      // setIsAdmin(false)
      return;
    } else {
      setOpendel(false);
      toast.error(`${username} is unable to delete`);
    }
  };
  return (
    <div className="overflow-x-auto">
      {mainu &&  mainu[0].read ? (
        <div className="w-full font-product">
          <div className="w-full  ">
            <button
              className="border-2  p-2 text-center ml-5 mt-5 shadow-md shadow-cyan-300 bg-[#00c853] rounded text-white hover:bg-white  hover:text-[#00c853] hover:border-[#00c853] hover:font-semibold "
              onClick={() => setOpenadd(true)}
            >
              Add User
            </button>
           <div className="flex justify-center py-4 font-product">
           <input type="text" placeholder="enter the details" className="w-96 pl-2 rounded shadow-lg " value={searchQuery} onChange={(e)=>(setSearchQuery(e.target.value))}></input>
           <select
                      id="fil"
                      value={fil}
                      
                      onChange={(e) => setfil(e.target.value)}
                      className="border ml-2 border-gray-300 shadow-lg rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="username">username</option>
                      <option value="email">email</option>
                      <option value="status">status</option>
                    </select>
                    <button className="border-2 p-2 ml-2 font-product  bg-[#2962ff] shadow-sm shadow-cyan-300 rounded-lg text-white hover:border-none hover:bg-white  hover:text-[#2979ff] hover:font-semibold  " onClick={()=>(searchF())}>Search</button>
                    <button className="border-2 p-2 ml-2 bg-[#ff1744] rounded-lg text-white shadow-sm shadow-cyan-300 hover:border-none hover:bg-white  hover:text-[#ff1744] hover:font-semibold  " onClick={()=>{
                        setisfiltered(false)
                        setfil('')
                        setSearchQuery('')

                    }}>Reset</button>
            </div>
          </div>
          <table className="min-w-full table-auto border-collapse">
  <thead>
    <tr className="bg-gray-100">
      <th className="border-b px-4 py-2 text-left">SR No.</th>
      <th className="border-b px-4 py-2 text-left">UserName</th>
      <th className="border-b px-4 py-2 text-left">Email</th>
      <th className="border-b px-4 py-2 text-center">Roles</th>
      <th className="border-b px-4 py-2 text-center">Status</th>
      <th className="border-b px-4 py-2 text-left">Permissions</th>
      <th className="border-b px-4 py-2 text-center">Update</th>
      <th className="border-b px-4 py-2 text-center">Delete</th>
    </tr>
  </thead>
  {
    !isfiltered ?<tbody>
    {adminusers.map((user, index) => (
       
      <tr key={user.id} className="odd:bg-white even:bg-gray-50">
        
        <td className="border-b px-4 py-2 text-left">{index + 1}</td>
        <td className="border-b px-4 py-2 text-left">{user.username}</td>
        <td className="border-b px-4 py-2 text-left">{user.email}</td>
        <td className="border-b px-4 py-2 text-center cursor-default">{user.isAdmin ? <div className="text-cyan-500 bg-cyan-100 rounded-lg px-2 py-1 text-center  ">Admin</div> : <div className="text-gray-500 bg-gray-200 rounded-lg px-2 py-1  ">Member</div>}</td>
        <td className="border-b px-4 py-2 text-center cursor-default">{user.isActive ? <div className="text-green-500 bg-green-100 rounded-lg px-2 py-1  ">Active</div> : <div className="text-[#ff1744] bg-red-100 rounded-lg px-2 py-1  ">Inactive</div>}</td>
        <td className="border-b px-4 py-2 text-left">
        <div className="text-sm cursor-default ">
             {user.read ? <h1 className="text-[#00c853] font-semibold">Read</h1>:null}
             {user.write ? <h1 className="text-[#ffd600] font-semibold">Write</h1>:null}
             {user.delete ? <h1 className="text-[#ff1744] font-semibold ">Delete</h1>:null}
          </div>
        </td>
        <td className="border-b px-4 py-2 text-center">
          {mainu[0].write ? (
            <button
              className="hover:text-blue-500 bg-blue-500 shadow-sm shadow-cyan-300 rounded text-white p-2 text-sm hover:bg-transparent hover:font-semibold"
              onClick={() => {
                setOpen(true);
                setcurr(user);
                setEmail(user.email);
                setUsername(user.username);
                setIsActive(user.isActive);
                setIsAdmin(user.isAdmin);
                setread(user.read);
                setwrite(user.write);
                setdel(user.delete);
              }}
            >
              Update
            </button>
          ) : (
            <button className="bg-gray-500 rounded cursor-not-allowed text-white p-2 text-sm hover:bg-gray-400">
              Update
            </button>
          )}
        </td>
        <td className="border-b px-4 py-2 text-center">
          {mainu[0].delete ? (
            <button
              className="hover:text-red-500 shadow-sm shadow-cyan-300 text-white bg-red-500 p-2 rounded text-sm hover:bg-transparent hover:font-semibold"
              onClick={() => {
                setOpendel(true);
                setcurr(user);
                setEmail(user.email);
                setUsername(user.username);
                setIsActive(user.isActive);
                setIsAdmin(user.isAdmin);
              }}
            >
              Delete
            </button>
          ) : (
            <button className="text-white bg-gray-500 p-2 rounded text-sm hover:bg-gray-400 cursor-not-allowed">
              Delete
            </button>
          )}
        </td>
      </tr>
    ))}
    {users.map((user, index) => (
      <tr key={user.id} className="odd:bg-white even:bg-gray-50">
        <td className="border-b px-4 py-2 text-left">{adminusers.length+index + 1}</td>
        <td className="border-b px-4 py-2 text-left">{user.username}</td>
        <td className="border-b px-4 py-2 text-left">{user.email}</td>
        <td className="border-b px-4 py-2 text-center cursor-default">{user.isAdmin ? <div className="text-cyan-500 bg-cyan-100 py-1 rounded-lg px-2  ">Admin</div> : <div className="text-gray-500 bg-gray-200 rounded-lg px-2  py-1">Member</div>}</td>
        <td className="border-b px-4 py-2 text-center cursor-default">{user.isActive ? <div className="text-green-500 bg-green-100 py-1 rounded-lg px-2 ">Active</div> : <div className="text-[#ff1744] bg-red-100 rounded-lg px-2   py-1">Inactive</div>}</td>
        <td className="border-b px-4 py-2 text-left cursor-default">
          <div >
             {user.read ? <h1 className="text-[#00c853] font-semibold">Read</h1>:null}
             {user.write ? <h1 className="text-[#ffd600] font-semibold">Write</h1>:null}
             {user.delete ? <h1  className="text-[#ff1744] font-semibold ">Delete</h1>:null}
          </div>
        </td>
        <td className="border-b px-4 py-2 text-center">
          {mainu[0].write ? (
            <button
              className="hover:text-blue-500 shadow-sm shadow-cyan-300 bg-blue-500 rounded text-white p-2 text-sm hover:bg-transparent hover:font-semibold"
              onClick={() => {
                setOpen(true);
                setcurr(user);
                setEmail(user.email);
                setUsername(user.username);
                setIsActive(user.isActive);
                setIsAdmin(user.isAdmin);
                setread(user.read);
                setwrite(user.write);
                setdel(user.delete);
              }}
            >
              Update
            </button>
          ) : (
            <button className="bg-gray-500 rounded cursor-not-allowed text-white p-2 text-sm hover:bg-gray-400">
              Update
            </button>
          )}
        </td>
        <td className="border-b px-4 py-2 text-center">
          {mainu[0].delete ? (
            <button
              className="hover:text-red-500 shadow-sm shadow-cyan-300 text-white bg-red-500 p-2 rounded text-sm hover:bg-transparent hover:font-semibold"
              onClick={() => {
                setOpendel(true);
                setcurr(user);
                setEmail(user.email);
                setUsername(user.username);
                setIsActive(user.isActive);
                setIsAdmin(user.isAdmin);
              }}
            >
              Delete
            </button>
          ) : (
            <button className="text-white bg-gray-500 p-2 rounded text-sm hover:bg-gray-400 cursor-not-allowed">
              Delete
            </button>
          )}
        </td>
      </tr>
    ))}
  </tbody> :<tbody>
    {filteredUsers.map((user, index) => (
       
      <tr key={user.id} className="odd:bg-white even:bg-gray-50">
        
        <td className="border-b px-4 py-2 text-left">{index + 1}</td>
        <td className="border-b px-4 py-2 text-left">{user.username}</td>
        <td className="border-b px-4 py-2 text-left">{user.email}</td>
        <td className="border-b px-4 py-2 text-center cursor-default">{user.isAdmin ? <div className="text-cyan-500 bg-cyan-100 rounded-lg px-2 py-1 text-center  ">Admin</div> : <div className="text-gray-500 bg-gray-200 rounded-lg px-2 py-1  ">Member</div>}</td>
        <td className="border-b px-4 py-2 text-center cursor-default">{user.isActive ? <div className="text-green-500 bg-green-100 rounded-lg px-2 py-1  ">Active</div> : <div className="text-[#ff1744] bg-red-100 rounded-lg px-2 py-1  ">Inactive</div>}</td>
        <td className="border-b px-4 py-2 text-left">
        <div className="text-sm cursor-default ">
             {user.read ? <h1 className="text-[#00c853] font-semibold">Read</h1>:null}
             {user.write ? <h1 className="text-[#ffd600] font-semibold">Write</h1>:null}
             {user.delete ? <h1 className="text-[#ff1744] font-semibold ">Delete</h1>:null}
          </div>
        </td>
        <td className="border-b px-4 py-2 text-center">
          {mainu[0].write ? (
            <button
              className="hover:text-blue-500 bg-blue-500 rounded text-white p-2 text-sm hover:bg-transparent hover:font-semibold"
              onClick={() => {
                setOpen(true);
                setcurr(user);
                setEmail(user.email);
                setUsername(user.username);
                setIsActive(user.isActive);
                setIsAdmin(user.isAdmin);
                setread(user.read);
                setwrite(user.write);
                setdel(user.delete);
              }}
            >
              Update
            </button>
          ) : (
            <button className="bg-gray-500 rounded cursor-not-allowed text-white p-2 text-sm hover:bg-gray-400">
              Update
            </button>
          )}
        </td>
        <td className="border-b px-4 py-2 text-center">
          {mainu[0].delete ? (
            <button
              className="hover:text-red-500 text-white bg-red-500 p-2 rounded text-sm hover:bg-transparent hover:font-semibold"
              onClick={() => {
                setOpendel(true);
                setcurr(user);
                setEmail(user.email);
                setUsername(user.username);
                setIsActive(user.isActive);
                setIsAdmin(user.isAdmin);
              }}
            >
              Delete
            </button>
          ) : (
            <button className="text-white bg-gray-500 p-2 rounded text-sm hover:bg-gray-400 cursor-not-allowed">
              Delete
            </button>
          )}
        </td>
      </tr>
    ))}
   
  </tbody>
  }
</table>

          <Modal open={openadd} onClose={() => setOpenadd(false)}>
            <div className="text-center w-96 font-product mx-auto p-4">
              <div className="flex justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-8 text-[#00c853]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                  />
                </svg>
              </div>

              <div className="mx-auto my-4 w-full">
                <h3 className="text-lg font-bold text-gray-800">Confirm Add</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to add this user?
                </p>

                <div className="space-y-4">
                 
                  <div className="flex items-center space-x-2">
                    <label className="w-28 text-right text-lg font-medium">
                      Username:
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="border-2 rounded-md w-full p-2"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="w-28 text-right text-lg font-medium">
                      Password:
                    </label>
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setpassword(e.target.value)}
                      className="border-2 rounded-md w-full p-2"
                    />
                  </div>
                
                  <div className="flex items-center space-x-2">
                    <label className="w-28 text-right text-lg font-medium">
                      Email:
                    </label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-2 rounded-md w-full p-2"
                    />
                  </div>

                
                  <div className="flex items-center space-x-2">
                    <label
                      htmlFor="isAdmin"
                      className="w-28 text-right text-lg font-medium"
                    >
                      Is Admin?
                    </label>
                    <select
                      id="isAdmin"
                      value={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.value)}
                      className="border border-gray-300 rounded-md w-full p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>

               
                  <div className="flex items-center space-x-2">
                    <label
                      htmlFor="isActive"
                      className="w-28 text-right text-lg font-medium"
                    >
                      Is Active?
                    </label>
                    <select
                      id="isActive"
                      value={isActive}
                      onChange={(e) => setIsActive(e.target.value)}
                      className="border border-gray-300 rounded-md w-full p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label
                      htmlFor="isActive"
                      className="w-28 text-right text-lg font-medium"
                    >
                      Read?
                    </label>
                    <select
                      id="isActive"
                      value={read}
                      onChange={(e) => setread(e.target.value)}
                      className="border border-gray-300 rounded-md w-full p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>     <div className="flex items-center space-x-2">
                    <label
                      htmlFor="isActive"
                      className="w-28 text-right text-lg font-medium"
                    >
                      Write?
                    </label>
                    <select
                      id="isActive"
                      value={write}
                      onChange={(e) => setwrite(e.target.value)}
                      className="border border-gray-300 rounded-md w-full p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label
                      htmlFor="isActive"
                      className="w-28 text-right text-lg font-medium"
                    >
                      Delete?
                    </label>
                    <select
                      id="isActive"
                      value={del}
                      onChange={(e) => setdel(e.target.value)}
                      className="border border-gray-300 rounded-md w-full p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  className="w-full bg-[#00e676] text-white py-2 rounded-md hover:bg-transparent hover:text-[#00c853] hover:border-[#69f0ae] hover:border-2 font-semibold"
                  onClick={addUsers}
                //   onClick={() => updateUsers()}
                >
                  Add
                </button>
                <button
                  className="w-full text-[#00c853] font-semibold hover:bg-green-100 py-2 rounded-md"
                  onClick={() => setOpenadd(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
          <Modal open={open} onClose={() => setOpen(false)}>
            <div className="text-center w-96 font-product mx-auto p-4">
              <div className="flex justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-10 w-10 text-blue-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </div>

              <div className="mx-auto my-4 w-full">
                <h3 className="text-lg font-bold text-gray-800">
                  Confirm Update
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to update this user?
                </p>

                <div className="space-y-4">
                
                  <div className="flex items-center space-x-2">
                    <label className="w-28 text-right text-lg font-medium">
                      Username:
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="border-2 rounded-md w-full p-2"
                    />
                  </div>

                
                  <div className="flex items-center space-x-2">
                    <label className="w-28 text-right text-lg font-medium">
                      Email:
                    </label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-2 rounded-md w-full p-2"
                    />
                  </div>

              
                  <div className="flex items-center space-x-2">
                    <label
                      htmlFor="isAdmin"
                      className="w-28 text-right text-lg font-medium"
                    >
                      Is Admin?
                    </label>
                    <select
                      id="isAdmin"
                      value={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.value)}
                      className="border border-gray-300 rounded-md w-full p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>

                
                  <div className="flex items-center space-x-2">
                    <label
                      htmlFor="isActive"
                      className="w-28 text-right text-lg font-medium"
                    >
                      Is Active?
                    </label>
                    <select
                      id="isActive"
                      value={isActive}
                      onChange={(e) => setIsActive(e.target.value)}
                      className="border border-gray-300 rounded-md w-full p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label
                      htmlFor="isActive"
                      className="w-28 text-right text-lg font-medium"
                    >
                      Read?
                    </label>
                    <select
                      id="isActive"
                      value={read}
                      onChange={(e) => setread(e.target.value)}
                      className="border border-gray-300 rounded-md w-full p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>     <div className="flex items-center space-x-2">
                    <label
                      htmlFor="isActive"
                      className="w-28 text-right text-lg font-medium"
                    >
                      Write?
                    </label>
                    <select
                      id="isActive"
                      value={write}
                      onChange={(e) => setwrite(e.target.value)}
                      className="border border-gray-300 rounded-md w-full p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label
                      htmlFor="isActive"
                      className="w-28 text-right text-lg font-medium"
                    >
                      Delete?
                    </label>
                    <select
                      id="isActive"
                      value={del}
                      onChange={(e) => setdel(e.target.value)}
                      className="border border-gray-300 rounded-md w-full p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-semibold"
                  // onClick={updateFn}
                  onClick={() => updateUsers()}
                >
                  Update
                </button>
                <button
                  className="w-full text-blue-500 font-semibold hover:bg-blue-100 py-2 rounded-md"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
          <Modal open={opendel} onClose={() => setOpendel(false)}>
            <div className="text-center w-56 font-product ">
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
                  className="btn btn-danger w-full bg-[#ff1744] text-white py-1 hover:border-2 hover:border-[#f50057] rounded-sm hover:bg-transparent hover:text-red-500 hover:font-semibold "
                  //   onClick={deleteFn}
                  onClick={deleteUser}
                >
                  Delete
                </button>
                <button
                  className="btn btn-light w-full text-red-500 font-semibold hover:bg-red-100 hover:rounded-sm "
                  onClick={() => setOpendel(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl max-sm:text-lg text-center py-48 font-product ">
            You didn't have the read permission
          </h1>
        </div>
      )}
    </div>
  );
}

export default User;

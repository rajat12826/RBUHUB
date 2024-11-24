import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Update from "./pages/Update";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Chat from "./components/Chat";

import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import ChatRoom from "./components/ChatRoom";
import User from "./components/User";
import supabase from "./config/supabaseClients";
import toast from "react-hot-toast";

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [curr, setcurr] = useState(null);
  const [isAdmin, setIsAdmin] = useState(curr ? curr?.isAdmin : "false");
  const [mainu, setmainu] = useState(null);
  const [adminusers, setadminUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [l, setL] = useState(null);

  const redirectToHome = () => {
    const link = document.createElement('a');
    link.href = '/';
    link.click(); 
  };
  // console.log(mainu);
  useEffect(()=>{
   const fetchUsers1=async()=>{
    const { data: data2, error: error1 } = await supabase
    .from("User")
    .select("*")
    .eq("user_id", user.user.id);
  if (data2) {
    setmainu(data2);
  }
  
 if(mainu && !mainu[0].isActive){
  const logOut = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? user.user.id : null;
    let { error } = await supabase.auth.signOut();
    console.log(error);
    const { data: data1, error: error1 } = await supabase
    .from("User")
    .update({isActive:false})
    .eq("user_id", userId);
    if (!error) {
      toast.success("Successfully Log Out!!");
      // navigate('/login')
      if (userId) {
        await supabase.from("online_users").delete().eq("id", userId);
      }

      localStorage.removeItem("user");
      localStorage.setItem("user", null);
      setTimeout(() => {
        localStorage.setItem("user", null);
        redirectToHome()
        // window.location.reload();
      }, 1000);
    } else {
      toast.error(`Logout error: ${error.message}`);
    }
  };
  logOut()
 }
   }
   fetchUsers1()
  },[])
  useEffect(() => {
    const fetchUser1=async()=>{
    
      
      const { data: data2, error: error1 } = await supabase
      .from("User")
      .select("*")
      .eq("user_id", user.user.id);
    if (data2) {
      setmainu(data2);
    }
    // console.log(data2);
    
 if(data2 && !data2[0].isActive){
  console.log("dndewhbhbdhjbh");
  
  const logOut = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? user.user.id : null;
    let { error } = await supabase.auth.signOut();
    console.log(error);
    const { data: data1, error: error1 } = await supabase
    .from("User")
    .update({isActive:false})
    .eq("user_id", userId);
    if (!error) {
      toast.success("Successfully Log Out!!");
      // navigate('/login')
      if (userId) {
        await supabase.from("online_users").delete().eq("id", userId);
      }

      localStorage.removeItem("user");
      localStorage.setItem("user", null);
     
      setTimeout(() => {
        localStorage.setItem("user", null);
        // navigate("/");
        redirectToHome()
      }, 1000);
    } else {
      toast.error(`Logout error: ${error.message}`);
    }
  };
  logOut()
 }
    }
    
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
        .eq("user_id", user.user.id);
      if (data2) {
        setmainu(data2);
      }
      if(mainu && !mainu[0].isActive){
        const logOut = async () => {
          const user = JSON.parse(localStorage.getItem("user"));
          const userId = user ? user.user.id : null;
          let { error } = await supabase.auth.signOut();
          console.log(error);
          const { data: data1, error: error1 } = await supabase
          .from("User")
          .update({isActive:false})
          .eq("user_id", userId);
          if (!error) {
            toast.success("Successfully Log Out!!");
            // navigate('/login')
            if (userId) {
              await supabase.from("online_users").delete().eq("id", userId);
            }
      
            localStorage.removeItem("user");
            localStorage.setItem("user", null);
            setTimeout(() => {
              localStorage.setItem("user", null);
              // navigate("/");
              // window.location.reload();
              redirectToHome()
            }, 1000);
          } else {
            toast.error(`Logout error: ${error.message}`);
          }
        };
        logOut()
       }
     
    };

    const channel = supabase
      .channel("public:User")
      .on("postgres_changes", { event: "INSERT", table: "User" }, (payload) => {
        // console.log("User Inserted:", payload);

        setUsers((prevUsers) => [...prevUsers, payload.new]);
      })
      .on("postgres_changes", { event: "UPDATE", table: "User" }, (payload) => {
        // console.log("User Updated:", payload.new.isAdmin);
        if (payload.new.isAdmin && isAdmin) {
          setadminUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === payload.new.id ? payload.new : user
            )
          );
          // console.log("dendjndjnjde",mainu);
        } else {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === payload.new.id ? payload.new : user
            )
          );
        }
        // console.log(users);
        fetchUsers();
        fetchUser1()
      })
      .on("postgres_changes", { event: "DELETE", table: "User" }, (payload) => {
        // console.log("User Deleted:", payload);

        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== payload.old.id)
        );
        fetchUsers();
        fetchUser1()
      })
      .subscribe();

    return () => {
      // supabase.removeSubscriptions([channel]);
      channel.unsubscribe();
    };
  }, []);

  return (
    <>
      <div className="h-screen">
        <BrowserRouter>
          <Navbar  mainu={mainu}/>
          <Routes>
            <Route
              path="/"
              element={
                <Home user={user} loading={loading} setLoading={setLoading} />
              }
            />
            <Route
              path="/create"
              element={
                <Create user={user} loading={loading} setLoading={setLoading} />
              }
            />
            <Route path="/:id" element={<Update user={user} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/login"
              element={
                <Login loading={loading} setLoading={setLoading} setL={setL} />
              }
            />
            <Route path="/chat" element={<Chat user={user} />} />
            <Route path="/room/:roomId" element={<ChatRoom user={user} />} />
            <Route
              path="/users"
              element={
                <User
                  users={users}
                  setUsers={setUsers}
                  adminusers={adminusers}
                  setadminUsers={setadminUsers}
                  curr={curr}
                  setcurr={setcurr}
                  isAdmin={isAdmin}
                  setIsAdmin={setIsAdmin}
                  mainu={mainu}
                  setmainu={setmainu}
                />
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
      <Toaster />
    </>
  );
}

export default App;

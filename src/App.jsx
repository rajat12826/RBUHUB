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

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [l, setL] = useState(null);
  useEffect(() => {
    
  }, [user]);

  return (
    <>
      <div className="h-screen">
        <BrowserRouter>
          <Navbar />
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
          </Routes>
        </BrowserRouter>
      </div>
      <Toaster />
    </>
  );
}

export default App;

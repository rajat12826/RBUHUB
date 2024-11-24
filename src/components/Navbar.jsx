import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClients";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
function Navbar({mainu}) {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(async () => {
      await supabase.auth.signOut();
      localStorage.removeItem("user");
      navigate("/");
    }, 4 * 60 * 60 * 1000);
  });
  console.log(mainu);
  
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
        navigate("/");
        window.location.reload();
      }, 1000);
    } else {
      toast.error(`Logout error: ${error.message}`);
    }
  };
  return (
    <>
      {localStorage.getItem("user") &&
        localStorage.getItem("user") !== "null" && (
          <div>
            <nav className=" bg-slate-900 font-product ">
              <h1 className="text-xl font-semibold ">RBU HUB</h1>
              <Link to="/" className="hover:font-semibold hover:text-green-500">
                Home
              </Link>
              <Link
                to="/chat"
                className="hover:font-semibold hover:text-green-500"
              >
                Chats
              </Link>
              <Link
                to="/create"
                className="hover:font-semibold hover:text-green-500"
              >
                Create New Note
              </Link>
              
              {
                (mainu && mainu[0].read)?
                <Link
                to="/users"
                className="hover:font-semibold hover:text-green-500"
              >
              RBAC
              </Link>:null
              }
              <button className="text-white font-semibold" onClick={logOut}>
                LogOut{" "}
              </button>
            </nav>
          </div>
        )}
    </>
  );
}

export default Navbar;

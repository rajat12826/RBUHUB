import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import supabase from "../config/supabaseClients";
import { Link, useNavigate } from "react-router-dom";
import { Typography, Input, Button } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import Loading from "./Loading";
function Login({ setL, loading, setLoading }) {
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      toast.error("Please fill in all the fields!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("does not exist")) {
        toast.error("Email does not exist. Try signing up.");
      } else {
        toast.error(`Sign-in error: ${error.message}`);
      }
      setLoading(false);
      return;
    }

    if (data) {
      console.log("data", data);

      toast.success("Sign-in successful!");

      console.log(data.user.id);
      const { data: data1, error: error1 } = await supabase.from("User").select("*").eq("user_id",data.user.id)

  console.log(error1,data1[0].avatar);
  

      const { error: onlineUserError } = await supabase
        .from("online_users")
        .insert([
          {
              avatar:data1[0].avatar?data1[0].avatar:"https://pbs.twimg.com/media/D0oEaNJWwAASCwt?format=jpg&name=small",
            username:data1[0].username?data1[0].username:"Anonymous",
          
            status: "online",
          },
        ]);

      if (onlineUserError) {
        console.error(
          "Error inserting into online_users:",
          onlineUserError.message
        );
        toast.error("Failed to update online status.");
      } else {
        toast.success("Sign-in successful!");
      }
      console.log(JSON.stringify(data));
      localStorage.setItem("user", JSON.stringify(data));
      setTimeout(() => {
        navigate("/");
      }, 500);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }

    setLoading(false);
  };

  return (
    <>
      <div className="flex justify-center "></div>
      {!loading ? (
        <div className="flex justify-center  w-full">
          <section className="grid text-center h-screen items-center p-8">
            <div className="border-4 p-5 rounded-xl shadow-2xl">
              <Typography
                variant="h3"
                color="blue-gray"
                className="mb-2 text-2xl "
              >
                Sign In
              </Typography>
              <Typography className="mb-5 text-gray-600 font-normal text-[18px]">
                Enter your email and password to sign in
              </Typography>
              <form action="#" className="mx-auto max-w-[24rem] text-left">
                <div className="mb-6">
                  <label htmlFor="email">
                    <Typography
                      variant="small"
                      className="mb-2 block font-medium text-gray-900"
                    >
                      Your Email
                    </Typography>
                  </label>
                  <Input
                    id="email"
                    color="gray"
                    size="lg"
                    type="email"
                    name="email"
                    placeholder="name@mail.com"
                    className="w-full placeholder:opacity-100 border-2 p-2 my-2"
                    labelProps={{
                      className: "hidden",
                    }}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="password">
                    <Typography
                      variant="small"
                      className="mb-2 block font-medium text-gray-900"
                    >
                      Password
                    </Typography>
                  </label>
                  <div className="relative">
                    <Input
                      size="lg"
                      placeholder="********"
                      labelProps={{
                        className: "hidden",
                      }}
                      className="w-full my-2 h-full placeholder:opacity-100 focus:border-primary border-blue-gray-200 p-2 pr-10" // Add right padding for the icon
                      type={passwordShown ? "text" : "password"}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {" "}
                      {/* Positioning the icon */}
                      <i
                        onClick={togglePasswordVisiblity}
                        className="p-2 cursor-pointer"
                      >
                        {passwordShown ? (
                          <EyeIcon className="h-5 w-5" />
                        ) : (
                          <EyeSlashIcon className="h-5 w-5" />
                        )}
                      </i>
                    </div>
                  </div>
                </div>
                <Button
                  color="gray"
                  size="lg"
                  className="mt-6 p-2 rounded hover:bg-transparent hover:border-4 hover:text-gray-900"
                  onClick={handleSignIn}
                  fullWidth
                >
                  Sign In
                </Button>
                <div className="!mt-4 flex justify-end">
                  <Typography
                    as="a"
                    href="#"
                    color="blue-gray"
                    variant="small"
                    className="font-medium"
                  >
                    Forgot password
                  </Typography>
                </div>
                <Button
                  variant="outlined"
                  size="lg"
                  className="mt-6 flex h-12 items-center justify-center gap-2 cursor-not-allowed "
                  fullWidth
                >
                  <img
                    src={`https://www.material-tailwind.com/logos/logo-google.png`}
                    alt="google"
                    className="h-6 w-6"
                  />{" "}
                  <h1 className="font-semibold"> Sign In With Google</h1>
                </Button>
                <Typography
                  variant="small"
                  color="gray"
                  className="!mt-4 text-center font-normal"
                >
                  Not registered?{" "}
                  <Link to="/signup" className="font-medium text-gray-900">
                    Create account
                  </Link>
                </Typography>
              </form>
            </div>
          </section>
        </div>
      ) : (
        <Loading />
      )}
      <Toaster />
    </>
  );
}

export default Login;

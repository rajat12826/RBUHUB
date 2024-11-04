import React, { useState } from "react";
import supabase from "../config/supabaseClients";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Typography, Input, Button } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { set } from "react-hook-form";
import { Toaster } from "react-hot-toast";
function SignUp() {
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);
  const[name,setname]=useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate=useNavigate()
const[loading,setloading]=useState(false)
  const handleSignUp = async (e) => {
    setloading(true)
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      toast.error("Fill All The Fields!!");
      return;
    }
    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!reg.test(email)) {
      toast.error("Invalid email format");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    const generateAvatarUrl = (email) => {
     return `https://api.dicebear.com/9.x/bottts/svg?seed=${email}`
  };
    
    // Usage:
    const avatar = generateAvatarUrl(email);
    console.log(avatar);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      console.log(error,data);
      // if (error) throw error;
      // console.log("u", data.user.id);
   
      if(error){
        if (error.message.includes("already registered")) {
          toast.error("Email is already registered. Try logging in.");
        }
      }
      if (data?.user) {
        const { error: insertError } = await supabase
          .from("User")
          .insert([
            { email: email, user_id: data.user.id, username: name,avatar },
          ]);
        console.log(insertError);

        if (insertError) {
          console.error("Error inserting user data:", insertError.message);
          toast.error("Error adding user data.");
          return;
        }
        // console.log(JSON.stringify(data));
        // localStorage.setItem("user", JSON.stringify(data));
        toast.success("Sign-Up successful!");
        // setLoading(false);
        setloading(false)
        setTimeout(() => {
          navigate("/login");
        }, 500);
        setTimeout(() => {
          window.location.reload();
        }, 500);
     
        // toast.success("Sign-up successful");
       
      }
    } catch (error) {
      setloading(false)
        toast.error(`Sign-up error: ${error.message}`);
     
    }
    setloading(false)
  };

  return (
    <>
      <div className="flex justify-center py-5">
        {/* <h1 className="text-xl font-semibold">SignUp To Supa Smoothies</h1> */}
      </div>
     {
      !loading?
       <div className="flex justify-center  w-full">
       


       <section className="grid text-center h-screen items-center p-8">
             <div className="border-4 p-5 rounded-xl shadow-2xl">
               <Typography variant="h3" color="blue-gray" className="mb-2 text-2xl ">
                 Sign Up
               </Typography>
               <Typography className="mb-5 text-gray-600 font-normal text-[18px]">
                 Enter your email and password to sign up
               </Typography>
               <form action="#" className="mx-auto max-w-[24rem] text-left">
               <div className="mb-6">
                   <label htmlFor="email">
                     <Typography
                       variant="small"
                       className="mb-2 block font-medium text-gray-900"
                     >
                       Your Username
                     </Typography>
                   </label>
                   <Input
                     id="name"
                     color="gray"
                     size="lg"
                     type="name"
                     name="name"
                     placeholder="rajat"
                     className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray p-2"
                     labelProps={{
                       className: "hidden",
                     }}
                     onChange={(e) => setname(e.target.value)}
                   />
                 </div>
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
                     className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray p-2"
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
           className="w-full h-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200 p-2 pr-10" // Add right padding for the icon
           type={passwordShown ? "text" : "password"}
           onChange={(e) => setPassword(e.target.value)}
         />
         <div className="absolute inset-y-0 right-0 flex items-center pr-3"> {/* Positioning the icon */}
           <i onClick={togglePasswordVisiblity} className="p-2 cursor-pointer">
             {passwordShown ? (
               <EyeIcon className="h-5 w-5" />
             ) : (
               <EyeSlashIcon className="h-5 w-5" />
             )}
           </i>
         </div>
       </div>
       
                 </div>
                 <Button color="gray" size="lg"  className="mt-6 p-2 rounded hover:bg-transparent hover:border-4 hover:text-gray-900" onClick={handleSignUp} fullWidth >
                   Sign Up
                 </Button>
                
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
                  Already  registered?{" "}
                   <Link to="/login" className="font-medium text-gray-900">
                     Sign In
                   </Link>
                 </Typography>
               </form>
             </div>
           </section>
             </div>:<div className="flex justify-center items-center py-48">
          <div role="status">
            <svg
              aria-hidden="true"
              class="w-16 h-16  animate-spin text-gray-400 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        </div>
     }
      <Toaster/>
    </>
  );
}

export default SignUp;

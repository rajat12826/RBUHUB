import { useEffect, useState } from "react";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import supabase from "../config/supabaseClients";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// import Demo from "../components/Demo";

const Create = ({ user }) => {
  const navigate = useNavigate();
  const [sub, setSub] = useState("");
  const [note, setNote] = useState("");
  // const [rating, setRating] = useState(0);
  const [formError, setFormError] = useState(null);
  console.log(user.user.id);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (!sub || !note ) {
      const errorMsg = "Please fill all fields";
      setFormError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    const { data, error } = await supabase
      .from("notes")
      .insert([{ subject:sub, note,  user_id: user.user.id }]);

    if (error) {
      const errorMsg = `Error occurred: ${error.message}`;
      setFormError(errorMsg);
      toast.error(errorMsg);
      setLoading(false);
      return;
    }

    setFormError(null);
    toast.success("Notes Successfully Created");
    setLoading(false);
    navigate("/");
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center py-48">
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
      ) : (
        <div className="flex justify-center items-center py-20">
          <div>
            <h1 className="flex justify-center py-2 font-semibold text-2xl text-gray-600">
              Create A New Note
            </h1>
            <form
              className="border-2 p-5 bg-white max-sm:w-screen"
              onSubmit={handleSubmit}
            >
              <div className="py-2">
                <label className="flex">
                  Subject:
                  <input
                    type="text"
                    className="ml-10 border-2 rounded-sm"
                    onChange={(e) => setSub(e.target.value)}
                  />
                </label>
              </div>
              <div className="py-2">
                <label className="flex">
                  <h1>Note:</h1>
                  <textarea
                    name="postContent"
                    rows={4}
                    cols={40}
                    className="ml-3 border-2"
                    onChange={(e) => setNote(e.target.value)}
                  />
                </label>
              </div>
              {/* <div className="py-2">
                <label className="flex">
                  Rating:
                  <div className="ml-5">
                    <Rating
                      style={{ maxWidth: 100 }}
                      value={rating}
                      onChange={setRating}
                    />
                  </div>
                </label>
              </div> */}
              <div className="w-full flex justify-center pt-10">
                <button className="text-white bg-blue-500 py-2 px-5 rounded-md hover:font-semibold hover:text-blue-500 hover:bg-transparent hover:border-2">
                  Create
                </button>
              </div>
              {formError && (
                <p className="text-red-500 mt-4 text-center">{formError}</p>
              )}
            </form>
          </div>
        </div>
      )}

      <Toaster />
    </>
  );
};

export default Create;

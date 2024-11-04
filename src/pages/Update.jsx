import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../config/supabaseClients";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { Rating } from "@smastrom/react-rating";
const Update = () => {
  const [sub, setSub] = useState("");
  const [note, setNote] = useState("");
  // const [rating, setRating] = useState(0);
  const [formError, setFormError] = useState(null);
  const { id } = useParams();

  console.log(id);

  const navigate = useNavigate();
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!sub || !note) {
      setFormError("Please fill all fields");
      toast.error(formError);
      return;
    }
    const { data, error } = await supabase
      .from("notes")
      .update({ subject:sub,note })
      .eq("id", id)
      .select();

    if (error) {
      setFormError(error.message);
      toast.error(formError);
    }
    if (data) {
      console.log(data);

      toast.success("Note Successfully Updated!!!!");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  };
  useEffect(() => {
    const fetchSmoothie = async () => {
      const { data, error } = await supabase
        .from("notes")
        .select()
        .eq("id", id)
        .single();
      if (error) {
        toast.error("Could not find your Note SORRY!!!");

        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
      if (data) {
        // setRating(data.rating);
        setSub(data.subject);
        setNote(data.note);
        console.log(data);
      }
    };
    fetchSmoothie();
  }, [id, navigate]);
  return (
    <>
      <div className="page update">
        <div>
          <h1 className="flex justify-center py-2 font-semibold text-2xl text-gray-600">
            Create A New Smoothie
          </h1>
          <form
            className="border-2 p-5 bg-white max-sm:w-screen"
            onSubmit={handleUpdate}
          >
            <div className="py-2 ">
              <label className="flex ">
               Subject:
                <input
                  type="text"
                  className="ml-10  border-2  rounded-sm  "
                  onChange={(e) => {
                    setSub(e.target.value);
                  }}
                ></input>
              </label>
            </div>
            <div className="py-2 ">
              <label className="flex ">
                <h1>Note:</h1>

                <textarea
                  name="postContent"
                  rows={4}
                  cols={40}
                  className="ml-3  border-2"
                  onChange={(e) => {
                    setNote(e.target.value);
                  }}
                />
              </label>
            </div>
            {/* <div className="py-2 ">
              <label className="flex ">
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
            <div className="w-full flex justify-center pt-10 ">
              {" "}
              <button className="text-white bg-blue-500 py-2 px-5 rounded-md hover:font-semibold hover:text-blue-500 hover:bg-transparent hover:border-2   ">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default Update;

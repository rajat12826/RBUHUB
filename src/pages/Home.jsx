import supabase from "../config/supabaseClients";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
// import SmoothiesCard from "../components/NotesCard";
import Login from "../components/Login";
import Demo from "../components/Demo";
import NotesCard from "../components/NotesCard";

const Home = ({ user, loading, setLoading }) => {
  const [fetchError, setFetchError] = useState(null);
  const [notes, setNotes] = useState([]);
  const [orderBy, setOrderBy] = useState("created_at");

  const handleDelete = (id) => {
    setNotes((prev) => prev.filter((sm) => sm.id !== id));
  };


  useEffect(() => {
    const fetchSmoothies = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("notes")
        .select()
        .order(orderBy, { ascending: false });

     
      if (data.length <= 0) {
        toast.error("No Notes found.");
        setLoading(false);
        return;
      }
      if (error) {
        setFetchError(`Could not fetch the notes: ${error.message}`);
        setNotes([]);
        toast.error("Failed to fetch the notes.");
        setLoading(false);
      } else {
        setNotes(data);
        setFetchError(null);
        toast.success("Successfully fetched notes!");
      }
      setLoading(false);
    };

    if (user) {
      fetchSmoothies();
    }
    const setU=async()=>{
      const { data: existingUser, error: existingUserError } = await supabase
          .from("online_users")
          .select("*")
          .eq("id", user?.user.id)
          .single();
          // console.log(existingUser);
          
      if (existingUser) {
        await supabase.from("online_users").delete().eq("id", user?.user.id);
      }
    }
    setU()
  }, [user, orderBy]);

  return (
    <>
      {loading ? (
        <Demo />
      ) : user && localStorage.getItem("user") !== "null" ? (
        <div className="page home ">
          {fetchError && <p className="text-red-500">{fetchError}</p>}
          {notes.length > 0 ? (
            <div className="flex flex-col">
              <div className="flex flex-col pl-1">
                <p className="text-gray-900 font-semibold flex">
                  Order By:{" "}
                  <span className="text-gray-500 ml-2 font-medium">
                    {orderBy}
                  </span>
                </p>
                <div className="flex py-2">
                  <button
                    onClick={() => setOrderBy("created_at")}
                    className="text-sm pl-2 hover:font-semibold hover:text-[#ff1744] hover:bg-transparent hover:border-[#ff1744] hover:border-2 bg-[#ff1744] py-1 text-white px-2 rounded-sm"
                  >
                    Time Created
                  </button>
                  <button
                    onClick={() => setOrderBy("title")}
                    className="text-sm pl-2 hover:font-semibold hover:text-[#0091ea] hover:bg-transparent bg-[#0091ea]  hover:border-2  hover:border-[#0091ea] ml-2 py-1 text-white px-2 rounded-sm"
                  >
                    Subject
                  </button>
                </div>
              </div>
              <div>
                {notes.map((note) => (
                  <NotesCard
                    key={note.id}
                    note={note}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-red-500 text-2xl font-bold flex justify-center ">
              No Notes found.
            </p>
          )}
        </div>
      ) : (
        <Login loading={loading} setLoading={setLoading} />
      )}

      <Toaster />
    </>
  );
};

export default Home;

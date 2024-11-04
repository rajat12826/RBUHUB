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
      // const filteredSmoothies = data.filter(
      //   (smoothie) => smoothie.user_id === user?.user.id
      // );
      console.log(notes);
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
  }, [user, orderBy]);

  return (
    <>
      {loading ? (
        <Demo />
      ) : user && localStorage.getItem("user") !== "null" ? (
        <div className="page home">
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
                    className="text-sm pl-2 hover:font-semibold hover:text-red-600 bg-red-500 py-1 text-white px-2 rounded-sm"
                  >
                    Time Created
                  </button>
                  <button
                    onClick={() => setOrderBy("title")}
                    className="text-sm pl-2 hover:font-semibold hover:text-green-700 bg-green-500 ml-2 py-1 text-white px-2 rounded-sm"
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

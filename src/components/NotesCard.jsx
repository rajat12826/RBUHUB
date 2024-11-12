import { Rating } from "@smastrom/react-rating";
import { Link } from "react-router-dom";
import supabase from "../config/supabaseClients";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
const NotesCard = ({ note, onDelete }) => {
  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("notes")
      .delete()
      .eq("id", note.id)
      .select();
    if (error) {
      toast.error("Unable To Find Your Note!!!!");
      return;
    }
    if (data) {
      toast.success("Note Deleted Successfully!!!!");
      onDelete(note.id);
    }
  };
  return (
    <>
      <div className="py-1">
        <div
          className="max-sm:text-sm  font-medium text-red-400 flex  border-4 rounded w-full
      px-5 py-5  justify-between "
        >
          <div className="flex flex-col max-sm:px-1">
            <h1 className="text-gray-500">Subject</h1>
            <h3 className="font-normal text-gray-400  ">{note.subject}</h3>
          </div>
          <div className="flex flex-col max-sm:px-1">
            <h1 className="text-gray-500">Note</h1>
            <h3 className="font-normal text-gray-400  ">{note.note}</h3>
          </div>
          {/* <div className="flex flex-col max-sm:px-1">
            <h1 className="text-gray-500">Rating</h1>
            <div className="ml-5 ">
              <Rating
                style={{ maxWidth: 100 }}
                value={smoothie.rating}
                readOnly
              />
            </div>
          </div> */}
          <div>
            <Link to={`/${note.id}`}>
              {" "}
              <button className="w-16 max-sm:mb-1 ml-2 hover:border-2 text-white bg-[#2962ff]  rounded-sm font-normal text-sm  py-2 hover:text-[#2962ff] hover:border-[#2962ff] hover:border-2 hover:font-bold hover:bg-transparent ">
                Update
              </button>
            </Link>
            <button
              className="w-16 ml-2 hover:border-2 text-white bg-red-500 px-2 rounded-sm font-normal text-sm  py-2 hover:text-red-500 hover:font-bold hover:bg-transparent "
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};
export default NotesCard;

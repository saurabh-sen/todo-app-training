import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { validateTodosInput, saveTodoInDB } from "../../utils/todo/todoUtils";

const TodosForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // validate input
    const isValidInput = validateTodosInput(title, description, date);
    if (!isValidInput) return;
    // save todo item to IndexedDB
    try {
      const result = await saveTodoInDB(title, description, date);
      if (result) {
        toast.success(result as string);
        setTitle("");
        setDescription("");
        setDate("");
        navigate(0);
      }
      console.log(result);
    } catch (error) {
      toast.error(error as string);
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-md p-6 shadow-md">
      <div className="border-b border-gray-300 pb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Todo Information
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="Title"
              className="block text-sm font-medium leading-5 text-gray-700"
            >
              Title
            </label>
            <div className="mt-1">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                id="Title"
                name="Title"
                type="text"
                className="block w-full rounded-md border border-gray-300 py-2 px-3 leading-5 focus:outline-none focus:ring focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="Date"
              className="block text-sm font-medium leading-5 text-gray-700"
            >
              Date
            </label>
            <div className="mt-1">
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                id="Date"
                name="Date"
                type="date"
                className="block w-full rounded-md border border-gray-300 py-2 px-3 leading-5 focus:outline-none focus:ring focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label
            htmlFor="Description"
            className="block text-sm font-medium leading-5 text-gray-700"
          >
            Description
          </label>
          <div className="mt-1">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="Description"
              name="Description"
              rows={3}
              className="block w-full rounded-md border border-gray-300 py-2 px-3 leading-5 resize-none focus:outline-none focus:ring focus:border-indigo-500"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Write a few sentences about your task.
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 text-white px-4 py-2 text-sm font-semibold shadow-md hover:bg-indigo-500 focus:outline-none focus:ring focus:border-indigo-500"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default TodosForm;

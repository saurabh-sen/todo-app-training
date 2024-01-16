interface ITodoItem {
  title: string;
  description: string;
  date: string;
}

const TodoItem = ({ title, description, date }: ITodoItem) => {
  return (
    <label
      htmlFor="check-todo"
      className="mb-4 border p-3 rounded-md shadow-md bg-white flex flex-row gap-4 items-center select-none w-full hover:bg-gray-100 transition-all duration-300"
    >
      <input id="check-todo" name="todo" type="checkbox" className="form-checkbox h-6 w-6 text-indigo-600" />
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between">
          <p className="text-lg font-semibold">{title}</p>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
        <p className="text-gray-700">{description}</p>
      </div>
    </label>

  );
};

export default TodoItem;

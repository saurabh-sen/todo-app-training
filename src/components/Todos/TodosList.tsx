import { ChangeEvent, useEffect, useState } from "react";

import { getAllTodos } from "../../utils/todo/todoUtils";
import TodoItem from "./TodoItem";

interface ITodos {
  title: string;
  description: string;
  date: string;
}

const TodosList = () => {
  const [todos, setTodos] = useState<ITodos[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<ITodos[]>([]);

  const [search, setSearch] = useState("");

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const query = e.target.value;
    setSearch(query);
    if (query === "") {
      setFilteredTodos(todos);
      return;
    }
    const result = todos.filter((item) => {
      if (
        item.title.includes(query) ||
        item.description.includes(query) ||
        item.date.includes(query)
      )
        return item;
    });
    setFilteredTodos(result);
  };

  useEffect(() => {
    const getTodos = async () => {
      try {
        const result = await getAllTodos();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setTodos(result);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setFilteredTodos(result);
      } catch (error) {
        console.log(error);
      }
    };
    getTodos();
  }, []);

  return (
    <div className="flex flex-col gap-2 justify-between md:w-96 bg-gradient-to-r from-indigo-400 to-purple-500 p-4 rounded-md">
      <label
        htmlFor="search"
        className="block text-sm font-semibold text-white"
      >
        🌟 Search
      </label>
      <div className="mt-2">
        <input
          id="search"
          name="search"
          type="search"
          className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-md ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6"
          value={search}
          onChange={handleSearch}
        />
      </div>
      <div className="flex flex-col justify-start items-center gap-7 h-auto md:h-[500px] overflow-y-auto">
        {filteredTodos.length === 0 ? (
          <p className="text-gray-200 text-center mt-4">No Todos found. Let's add some tasks! 🚀</p>
        ) : (
          filteredTodos.map((item, index) => (
            <TodoItem key={index} {...item} />
          ))
        )}
      </div>
    </div>

  );
};

export default TodosList;

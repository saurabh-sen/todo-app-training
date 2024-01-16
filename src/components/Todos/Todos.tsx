import TodosList from "./TodosList";
import TodosForm from "./TodosForm";

const Todos = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen justify-center items-center md:gap-20 gap-10 py-10 md:py-0">
      <TodosList />
      <TodosForm />
    </div>
  );
};

export default Todos;

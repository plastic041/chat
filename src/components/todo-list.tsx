import { useUser } from "@clerk/nextjs";
import type { Todo } from "@prisma/client";
import { type FormEvent, useState } from "react";
import useSWR from "swr";

export function TodoListContainer() {
  const { user } = useUser();

  const { data } = useSWR<Todo[]>(user ? `/api/todo` : null, async (url) => {
    const res = await fetch(url);
    return res.json();
  });

  if (!user) {
    return null;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <AddTodo />
      <Todos todos={data} />
    </div>
  );
}

function Todos({ todos }: { todos: Todo[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

function TodoItem({ todo }: { todo: Todo }) {
  function handleToggle() {
    fetch(`/api/todo/${todo.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: !todo.completed,
      }),
    });
  }

  function handleEdit() {
    fetch(`/api/todo/${todo.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: prompt("Edit title", todo.title),
      }),
    });
  }

  return (
    <li key={todo.id} className="flex flex-row gap-2 items-center">
      <input
        id={`todo-${todo.id}`}
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
      />
      <label
        htmlFor={`todo-${todo.id}`}
        className={`${
          todo.completed ? "line-through" : ""
        } text-gray-700 text-lg`}
      >
        {todo.title}
      </label>
    </li>
  );
}

function AddTodo() {
  const { user } = useUser();

  const [title, setTitle] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        // @ts-expect-error user has an id
        // because AddTodo is only rendered
        // when user is logged in
        userId: user.id,
      }),
    });

    setTitle("");
  }

  return (
    <form
      className="flex flex-row gap-2 h-10 items-stretch"
      onSubmit={handleSubmit}
    >
      <input
        className="border border-gray-300 rounded p-2"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button className="bg-blue-500 text-white rounded p-2" type="submit">
        Add Todo
      </button>
    </form>
  );
}

import { useUser } from "@clerk/nextjs";
import type { Ping } from "@prisma/client";
import useSWR from "swr";
import { MakePing } from "./make-ping";

export function PingsContainer() {
  const { user } = useUser();

  const { data } = useSWR<{
    pinged: Ping[];
    recieved: Ping[];
  }>(user ? `/api/ping` : null, async (url) => {
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
      <MakePing />
      <Pings pings={data} />
    </div>
  );
}

function Pings({
  pings: { pinged, recieved },
}: {
  pings: { pinged: Ping[]; recieved: Ping[] };
}) {
  return (
    <div className="grid grid-cols-2 gap-x-4">
      <div className="bg-blue-50 px-8 py-4 rounded shadow-md flex flex-col gap-2">
        <h3 className="text-lg font-bold">Sent Pings</h3>
        <ul className="flex flex-col gap-2">
          {pinged.map((ping) => (
            <PingItem key={ping.id} todo={ping} />
          ))}
        </ul>
      </div>
      <div className="bg-blue-50 px-8 py-4 rounded shadow-md flex flex-col gap-2">
        <h3 className="text-lg font-bold">Recieved Pings</h3>
        <ul className="flex flex-col gap-2">
          {recieved.map((ping) => (
            <PingItem key={ping.id} todo={ping} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function PingItem({ todo: ping }: { todo: Ping }) {
  // function handleToggle() {
  //   fetch(`/api/todo/${todo.id}`, {
  //     method: "PATCH",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       completed: !ping.,
  //     }),
  //   });
  // }

  // function handleEdit() {
  //   fetch(`/api/todo/${todo.id}`, {
  //     method: "PATCH",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       title: prompt("Edit title", todo.title),
  //     }),
  //   });
  // }

  return (
    <li key={ping.id} className="flex flex-row gap-2 items-center">
      <span>{ping.recieverId}</span>
      {/* <input
        id={`todo-${todo.id}`}
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
      /> */}
      {/* <label
        htmlFor={`todo-${todo.id}`}
        className={`${
          todo.completed ? "line-through" : ""
        } text-gray-700 text-lg`}
      >
        {todo.title}
      </label> */}
    </li>
  );
}

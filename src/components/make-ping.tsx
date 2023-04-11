import { useUser } from "@clerk/nextjs";
import useSWR from "swr";

export function MakePing() {
  const { user } = useUser();

  const { data } = useSWR<{ users: string[] }>(
    user ? `/api/user` : null,
    async (url) => {
      const res = await fetch(url);
      return res.json();
    }
  );

  if (!data || !user) {
    return null;
  }

  async function handleClick(recieverId: string) {
    await fetch("/api/ping", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recieverId,
      }),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-2">
        {data.users.map((userId) => (
          <li key={userId} className="flex flex-row gap-2 items-center">
            <span>{userId}</span>
            <button
              className="bg-blue-500 text-white rounded px-2 py-1 text-sm transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-black"
              onClick={() => handleClick(userId)}
            >
              Ping!
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

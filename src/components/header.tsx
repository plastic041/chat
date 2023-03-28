import {
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";

export function Header() {
  const { user } = useUser();

  return (
    <header className="bg-blue-200 shadow p-4 flex flex-row justify-between">
      <span className="text-2xl font-bold">Todo App</span>
      <div className="flex flex-row gap-2 items-end">
        <SignedIn>
          <UserButton />
          <span className="">{user?.username}</span>
        </SignedIn>
        <SignedOut>
          <Link href="/sign-in">
            <span className="text-blue-500 cursor-pointer">Sign In</span>
          </Link>
        </SignedOut>
      </div>
    </header>
  );
}

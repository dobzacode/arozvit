import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";


export default function HomePage() {
  return (
    <main className="container h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="sm:text-[5rem] text-5xl font-extrabold tracking-tight">
          Create <span className="text-primary">T3</span>
        </h1>
        <ClerkLoading>
          <Loader className="h-5 w-5 text-muted-foreground" />
        </ClerkLoading>

        <ClerkLoaded>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="w-fit rounded-lg bg-blue-500 p-4 text-white">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </ClerkLoaded>
      </div>
    </main>
  );
}

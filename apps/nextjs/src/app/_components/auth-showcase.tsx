import { auth, signIn, signOut } from "@planty/auth";

export async function AuthShowcase() {
  const session = await auth();

  if (!session) {
    return (
      <form>
        <button
          formAction={async () => {
            "use server";
            await signIn("discord");
          }}
        >
          Sign in with Discord
        </button>
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        <span>Logged in as {session.user.name}</span>
      </p>

      <form>
        <button
          formAction={async () => {
            "use server";
            await signOut();
          }}
        >
          Sign out
        </button>
      </form>
    </div>
  );
}

import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function Page() {
  const auth = useAuth();

  return <Redirect href={`${auth.isSignedIn ? "/home" : "/login"}`} />;
}

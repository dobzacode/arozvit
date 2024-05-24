import React from "react";
import { Pressable } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";

import { useWarmUpBrowser } from "../hooks/useWarmUpBrowser";

WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuth = ({
  children,
  strategy,
  testID,
}: {
  children: React.ReactNode;
  strategy: "google" | "facebook" | "apple";
  testID: string;
}) => {
  // Warm up the android browser to improve UX
  // https://docs.expo.dev/guides/authentication/#improving-user-experience
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: `oauth_${strategy}` });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, [startOAuthFlow]);

  return (
    <Pressable
      testID={testID}
      className="surface-container-low flex w-full flex-row items-center justify-center gap-sm rounded-sm px-md py-sm"
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
};
export default SignInWithOAuth;

import React from "react";
import { Text } from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import { act, render } from "@testing-library/react-native";

import SignInWithOAuth from "~/components/auth/sign-in-with-oauth";

jest.mock("@clerk/clerk-expo", () => ({
  useOAuth: jest.fn(() => ({
    startOAuthFlow: jest.fn(() =>
      Promise.resolve({ createdSessionId: "mock-session-id" }),
    ),
  })),
}));

describe("SignInWithOAuth", () => {
  it("should render the button with correct text and trigger OAuth flow on press", async () => {
    const { getByTestId } = render(
      <SignInWithOAuth role="link" strategy="apple" testID="apple-oauth-button">
        <Text className="button-txt text-center text-surface-fg dark:text-surface">
          Continuer avec Apple
        </Text>
      </SignInWithOAuth>,
    );
    const link = getByTestId("apple-oauth-button");
    expect(link).toBeTruthy();
    await act(async () => link.props.onClick());
    expect(useOAuth).toHaveBeenCalledWith({ strategy: "oauth_apple" });
  });
});

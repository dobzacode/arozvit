import React from "react";
import { render } from "@testing-library/react-native";

import SignInSection from "./sign-in-section";

jest.mock("@clerk/clerk-expo", () => ({
  useOAuth: jest.fn(() => ({
    startOAuthFlow: jest.fn(() =>
      Promise.resolve({ createdSessionId: "mock-session-id" }),
    ),
  })),
}));

describe("SignInSection", () => {
  it("should render all three sign-in buttons with correct text and icons", () => {
    const { getByTestId, getAllByText } = render(<SignInSection />);

    const buttons = getAllByText(/Continuer avec/i);
    expect(buttons.length).toBe(3);

    const appleButton = getByTestId("apple-oauth-button");
    expect(appleButton).toBeTruthy();

    const facebookButton = getByTestId("facebook-oauth-button");
    expect(facebookButton).toBeTruthy();

    const googleButton = getByTestId("google-oauth-button");
    expect(googleButton).toBeTruthy();
  });
});

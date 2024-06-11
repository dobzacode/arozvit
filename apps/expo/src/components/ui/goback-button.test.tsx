import { router } from "expo-router";
import { fireEvent, render, screen } from "@testing-library/react-native";

import GoBackButton from "./goback-button";

describe("GoBackButton", () => {
  it("should render the button and call router.push on press", () => {
    const mockPush = jest.fn();
    router.push = mockPush;

    render(<GoBackButton path="/previous-screen" />);

    const button = screen.getByRole("button");
    expect(button).toBeTruthy();

    fireEvent.press(button);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/previous-screen");
  });
});

import events from "events";
import { Appearance } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { useColorScheme } from "nativewind";

import TopMenu from "./top-menu";

let mockCurrentColorScheme = "light";
const mockAppearanceEventEmitter = new events.EventEmitter();

jest.mock("nativewind", () => ({
  useColorScheme: jest.fn(() => {
    return { colorScheme: mockCurrentColorScheme };
  }),
}));

jest.mock("@clerk/clerk-expo", () => ({
  useUser: jest.fn().mockReturnValue({
    user: {
      imageUrl: "https://example.com/image.jpg",
    },
    isLoaded: true,
  }),
}));

jest.mock("react-native/Libraries/Utilities/Appearance", () => {
  return {
    getColorScheme: jest.fn(() => {}),

    addChangeListener: () => {},
    // @ts-expect-error
    setColorScheme: (colorScheme) => {
      mockCurrentColorScheme = colorScheme;
      mockAppearanceEventEmitter.emit("change", { colorScheme });
    },
  };
});

describe("TopMenu component", () => {
  it("renders correctly with user image and light theme icon", () => {
    const { getByTestId } = render(<TopMenu />);

    const userImage = getByTestId("user-image");
    expect(userImage).toBeTruthy();
    screen.debug();
    expect(userImage.props.source.uri).toEqual("https://example.com/image.jpg");

    expect(getByTestId("light-icon")).toBeTruthy();
  });

  it("renders correctly with placeholder image and dark theme icon", () => {
    (useColorScheme as jest.Mock).mockReturnValueOnce({ colorScheme: "dark" });
    (useUser as jest.Mock).mockReturnValueOnce({
      user: {
        imageUrl: "",
      },
      isLoaded: true,
    });
    const { getByTestId } = render(<TopMenu />);

    const userImage = getByTestId("user-image");
    expect(userImage).toBeTruthy();
    screen.debug();
    expect(userImage.props.alt).toEqual("Placeholder user image");

    expect(getByTestId("dark-icon")).toBeTruthy();
  });

  it("toggles theme on icon press", async () => {
    const { getByTestId } = render(<TopMenu />);
    const themeIcon = getByTestId("light-icon");

    const appSpy = jest.spyOn(Appearance, "setColorScheme");

    await act(async () => {
      fireEvent.press(themeIcon);
    });

    expect(appSpy).toHaveBeenCalledTimes(1);
  });
});

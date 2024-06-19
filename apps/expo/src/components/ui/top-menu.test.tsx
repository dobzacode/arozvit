import { render, screen } from "@testing-library/react-native";

import TopMenu from "./top-menu";

jest.mock("@clerk/clerk-expo", () => ({
  useUser: jest.fn().mockReturnValue({
    user: {
      imageUrl: "https://example.com/image.jpg",
    },
    isLoaded: true,
  }),
}));

describe("TopMenu component", () => {
  it("renders correctly with user image", () => {
    const { getByTestId } = render(<TopMenu />);

    const userImage = getByTestId("user-image");
    expect(userImage).toBeTruthy();
    screen.debug();
    expect(userImage.props.source.uri).toEqual("https://example.com/image.jpg");
  });
});

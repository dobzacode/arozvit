import { render, screen } from "@testing-library/react-native";

import TopMenu from "./top-menu";

jest.mock("~/utils/api", () => ({
  api: {
    user: {
      getImage: {
        useQuery: jest.fn(() => ({
          data: "https://example.com/image.jpg",
          isLoading: true,
        })),
      },
    },
  },
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

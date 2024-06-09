import { render, screen } from "@testing-library/react-native";

import PlantSnippetSection from "./plant-snippet-section";

jest.mock("./plant-card-snippet.tsx", () => () => {
  //@ts-expect-error mock component
  return <mock-plant-card-snippet testID="mock-plant-card-snippet" />;
});

jest.mock("~/utils/api", () => ({
  api: {
    plant: {
      getPlantByWateringDay: {
        useQuery: jest.fn(() => ({
          data: [{ id: 2 }, { id: 3 }],
          isError: false,
          isLoading: false,
        })),
      },
    },
  },
}));

describe("PlantCardSnippet", () => {
  it("renders two plant card snippet with the correct data", async () => {
    render(<PlantSnippetSection date="2024-06-02" />);
    expect(screen.getAllByTestId("mock-plant-card-snippet")).toHaveLength(2);
  });
});

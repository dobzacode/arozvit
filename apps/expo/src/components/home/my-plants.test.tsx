import React from "react";
import { render } from "@testing-library/react-native";

import { api } from "~/utils/api";
import MyPlants from "./my-plants";

jest.mock("./my-plants/plant-card", () => ({
  __esModule: true,
  default: () => <p data-testid="plant-card">plant-card</p>,
}));

jest.mock("./my-plants/next-watering", () => ({
  __esModule: true,
  default: () => <p data-testid="next-watering">next-watering</p>,
}));

jest.mock("~/utils/api", () => ({
  api: {
    plant: {
      listID: {
        useQuery: jest.fn(() => ({
          data: [],
          isLoading: false,
          isError: false,
        })),
      },
    },
  },
}));

describe("MyPlants component", () => {
  it("renders loading indicator while data is being fetched", () => {
    (api.plant.listID.useQuery as jest.Mock).mockReturnValueOnce({
      data: [],
      isLoading: true,
      isError: false,
    });
    const { getByTestId } = render(<MyPlants />);

    expect(getByTestId("activity-indicator")).toBeTruthy();
  });

  it("renders error message when data fetching fails", () => {
    (api.plant.listID.useQuery as jest.Mock).mockReturnValueOnce({
      data: [],
      isLoading: false,
      isError: true,
    });
    const { getByText } = render(<MyPlants />);

    expect(getByText("Error")).toBeTruthy();
  });

  it("renders no content when data is null", () => {
    (api.plant.listID.useQuery as jest.Mock).mockReturnValueOnce({
      data: null,
      isLoading: false,
      isError: false,
    });
    const { queryByTestId } = render(<MyPlants />);

    expect(queryByTestId("my-plants")).toBeFalsy();
  });

  it("renders plant list and NextWatering component with data", () => {
    (api.plant.listID.useQuery as jest.Mock).mockReturnValueOnce({
      data: [{ id: 1 }, { id: 2 }],
      isLoading: false,
      isError: false,
    });
    const { findByText, getByText, findAllByText } = render(<MyPlants />);

    expect(getByText("Mes plantes")).toBeTruthy();
    expect(findAllByText("plant-card")).toBeTruthy();
    expect(findByText("next-watering")).toBeTruthy();
  });
});

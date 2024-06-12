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
      getAll: {
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
  it("renders no content when data is null", () => {
    (api.plant.getAll.useQuery as jest.Mock).mockReturnValueOnce({
      data: null,
      isLoading: false,
      isError: false,
    });
    const { queryByTestId } = render(<MyPlants />);

    expect(queryByTestId("my-plants")).toBeFalsy();
  });

  it("renders plant list", () => {
    (api.plant.getAll.useQuery as jest.Mock).mockReturnValueOnce({
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

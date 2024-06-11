import React from "react";
import { render, screen } from "@testing-library/react-native";
import moment from "moment";

import { api } from "~/utils/api";
import TopBlock from "./top-block";

jest.mock("~/utils/api", () => ({
  api: {
    plant: {
      getPlantsWithWateringNeed: {
        useQuery: jest.fn(() => ({
          data: [],
          isLoading: false,
          isError: false,
        })),
      },
    },
  },
}));

jest.mock("./top-block/notifications", () => ({
  __esModule: true,
  default: jest.fn(() => <p data-testid="notifications">notifications</p>),
}));

describe("TopBlock component", () => {
  it("renders nothing when isLoading is true", () => {
    (
      api.plant.getPlantsWithWateringNeed.useQuery as jest.Mock
    ).mockReturnValueOnce({
      data: [],
      isLoading: true,
      isError: false,
    });
    const { queryByTestId } = render(<TopBlock />);

    expect(queryByTestId("top-block")).toBeFalsy();
  });

  it("renders nothing when isError is true and data is empty", () => {
    (
      api.plant.getPlantsWithWateringNeed.useQuery as jest.Mock
    ).mockReturnValueOnce({
      data: [],
      isLoading: false,
      isError: true,
    });
    const { queryByTestId } = render(<TopBlock />);

    expect(queryByTestId("top-block")).toBeFalsy();
  });

  it("renders nothing when there are no plants needing watering", () => {
    (
      api.plant.getPlantsWithWateringNeed.useQuery as jest.Mock
    ).mockReturnValueOnce({
      data: [
        { name: "Plant A", nextWatering: moment().add(1, "year").toDate() },
      ],
      isLoading: false,
      isError: false,
    });
    const { queryByTestId } = render(<TopBlock />);

    expect(queryByTestId("top-block")).toBeFalsy();
  });

  it("renders Today component for plants needing watering today", () => {
    const today = moment().toDate();
    (
      api.plant.getPlantsWithWateringNeed.useQuery as jest.Mock
    ).mockReturnValueOnce({
      data: [{ name: "Plant A", nextWatering: today }],
      isLoading: false,
      isError: false,
    });
    const { getByTestId } = render(<TopBlock />);

    expect(getByTestId("today-component")).toBeTruthy();
  });

  it("renders Notifications component for plants with passed watering date", async () => {
    const date = moment().subtract(1, "day").toDate();
    (
      api.plant.getPlantsWithWateringNeed.useQuery as jest.Mock
    ).mockReturnValueOnce({
      data: [{ name: "Plant A", nextWatering: date }],
      isLoading: false,
      isError: false,
    });
    render(<TopBlock />);

    screen.debug();

    expect(screen.findByText("notifications")).toBeTruthy();
  });

  it("renders both Today and Notifications for plants in different categories", () => {
    const today = moment().toDate();
    (
      api.plant.getPlantsWithWateringNeed.useQuery as jest.Mock
    ).mockReturnValueOnce({
      data: [
        { name: "Plant A", nextWatering: today },
        { name: "Plant B", nextWatering: moment(today).subtract(1, "day") },
      ],
      isLoading: false,
      isError: false,
    });
    const { getByTestId, findByText } = render(<TopBlock />);

    expect(getByTestId("today-component")).toBeTruthy();
    expect(findByText("notifications")).toBeTruthy();
  });
});

import React from "react";
import { render } from "@testing-library/react-native";
import moment from "moment";

import { Plant } from "@planty/validators";

import PlantCardAction from "./plant-card-action";

jest.mock("../ui/watering-button", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="watering-button" />),
}));

jest.mock("../ui/delete-button", () => ({
  __esModule: true,
  default: jest.fn(({ children }) => (
    <div data-testid="delete-button">{children}</div>
  )),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: () => [true, jest.fn()],
}));

jest.doMock("moment-timezone", () => {
  const moment = () => ({
    format: () => {},
  });

  moment.tz = {
    setDefault: () => {},
  };

  return moment;
});

jest.mock("moti/build", () => {
  return {
    MotiView: jest.fn(({ children }) => (
      <div data-testid="moti-view">{children}</div>
    )),
  };
});

const mockPlant: Plant = {
  id: "2",
  description: "lorem",
  imageUrl: "ipsum",
  userId: "1",
  createdAt: new Date(),
  dayBetweenWatering: 1,
  updatedAt: new Date(),
  name: "Plant 2",
  wateringInterval: "années",
  nextWatering: new Date(2024, 5, 2),
  lastWatering: new Date(2024, 2, 2),
  species: "species",
};

describe("PlantCardAction component", () => {
  it("renders plant information and buttons", () => {
    const { getByText } = render(
      <PlantCardAction
        lastWatering={mockPlant.lastWatering}
        colorScheme={"dark"}
        plant={mockPlant}
        searchTerm=""
      />,
    );

    expect(getByText(mockPlant.name)).toBeTruthy();
    expect(
      getByText(
        `Arrosé le ${moment(mockPlant.lastWatering).format("DD/MM/YYYY")}`,
      ),
    ).toBeTruthy();
    expect(
      getByText(
        `Prochain arrosage le ${moment(mockPlant.nextWatering).format("DD/MM/YYYY")}`,
      ),
    ).toBeTruthy();
  });

  it("shows loading indicator while isLoading is true", () => {
    const { getByTestId } = render(
      <PlantCardAction
        lastWatering={mockPlant.lastWatering}
        colorScheme={"dark"}
        plant={mockPlant}
        searchTerm=""
      />,
    );

    expect(getByTestId("loading-indicator")).toBeTruthy();
  });
});

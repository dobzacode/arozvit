import { render, screen } from "@testing-library/react-native";
import moment from "moment";

import { Plant } from "@arozvit/validators";

import WateringCard from "./watering-card";

jest.mock("@arozvit/validators", () => ({
  Plant: jest.fn(() => ({})),
}));

jest.mock("~/components/ui/watering-button", () => ({
  __esModule: true,
  default: jest.fn(() => <p>watering button</p>),
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

const plantObj: Plant = {
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

describe("WateringCard", () => {
  it("should render watering information and button", () => {
    render(<WateringCard plant={plantObj} />);

    const title = screen.getByText("Arrosage");
    expect(title).toBeTruthy();

    const lastWateringText = screen.getByText(
      `Dernier arrosage : ${moment(plantObj.lastWatering).format("DD/MM/YYYY")}`,
    );
    expect(lastWateringText).toBeTruthy();

    const nextWateringText = screen.getByText(
      `Prochain arrosage : ${moment(plantObj.nextWatering).format("DD/MM/YYYY")}`,
    );
    expect(nextWateringText).toBeTruthy();

    const wateringFrequencyText = screen.getByText(
      `Fréquence d'arrosage : tous les ${plantObj.dayBetweenWatering} ${plantObj.wateringInterval}`,
    );
    expect(wateringFrequencyText).toBeTruthy();

    const wateringButton = screen.findByText("watering button");
    expect(wateringButton).toBeTruthy();
  });

  it("should render loading indicator while watering", () => {
    render(<WateringCard plant={plantObj} />);

    const loadingIndicator = screen.getByTestId("loading-indicator");
    expect(loadingIndicator).toBeTruthy();
  });
});

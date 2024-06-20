import { act, fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

import { Plant } from "@arozvit/validators";

import PlantForm from "./plant-form";

jest.mock("@clerk/clerk-expo", () => ({
  useAuth: jest.fn(() => ({ userId: "mock-user-id", isLoaded: true })),
}));

jest.mock("./image-upload", () => ({
  __esModule: true,
  default: () => <p data-testid="image-upload">image-upload</p>,
}));

jest.mock("~/utils/api", () => ({
  api: {
    useUtils: jest.fn(() => ({})),
    plant: {
      update: {
        useMutation: jest.fn(() => ({
          mutate: jest.fn(),
          error: null,
          isPending: false,
        })),
      },
      create: {
        useMutation: jest.fn(() => ({
          mutate: jest.fn(),
          error: null,
          isPending: false,
        })),
      },
    },
  },
}));

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

describe("PlantForm", () => {
  it("should render the form and allow user input", async () => {
    render(<PlantForm />);

    const nameInput = screen.getByTestId("nameInput");
    expect(nameInput).toBeTruthy();
    await act(async () => fireEvent.changeText(nameInput, "New Plant"));
    expect(screen.getByDisplayValue("New Plant")).toBeTruthy();

    const speciesInput = screen.getByTestId("speciesInput");
    expect(speciesInput).toBeTruthy();
    await act(async () => fireEvent.changeText(speciesInput, "Epiprennum"));
    expect(screen.getByDisplayValue("Epiprennum")).toBeTruthy();

    const descriptionInput = screen.getByTestId("descriptionInput");
    expect(descriptionInput).toBeTruthy();
    await act(async () =>
      fireEvent.changeText(descriptionInput, "Beautiful plant"),
    );
    expect(screen.getByDisplayValue("Beautiful plant")).toBeTruthy();

    const dayBetweenWateringInput = screen.getByTestId(
      "dayBetweenWateringInput",
    );
    expect(dayBetweenWateringInput).toBeTruthy();
    await act(async () => fireEvent.changeText(dayBetweenWateringInput, "2"));
    expect(screen.getByDisplayValue("2")).toBeTruthy();

    const wateringIntervalDropdown = screen.getByTestId(
      "wateringIntervalDropdown",
    );
    expect(wateringIntervalDropdown).toBeTruthy();
    await act(async () => fireEvent.press(wateringIntervalDropdown));

    const joursOption = await screen.findByText("jours");
    await act(async () => fireEvent.press(joursOption));
    expect(screen.getByText("jours")).toBeTruthy();
  });

  it("should render the form pre-filled with plant data and allow editing", async () => {
    render(<PlantForm plant={plantObj} />);

    const nameInput = screen.getByTestId("nameInput");
    expect(nameInput).toBeTruthy();
    expect(screen.getByDisplayValue(plantObj.name)).toBeTruthy();

    const speciesInput = screen.getByTestId("speciesInput");
    expect(speciesInput).toBeTruthy();
    //@ts-expect-error is filled with plantObj
    expect(screen.getByDisplayValue(plantObj.species)).toBeTruthy();

    const descriptionInput = screen.getByTestId("descriptionInput");
    expect(descriptionInput).toBeTruthy();
    //@ts-expect-error is filled with plantObj
    expect(screen.getByDisplayValue(plantObj.description)).toBeTruthy();

    const dayBetweenWateringInput = screen.getByTestId(
      "dayBetweenWateringInput",
    );
    expect(dayBetweenWateringInput).toBeTruthy();
    expect(
      screen.getByDisplayValue(plantObj.dayBetweenWatering.toString()),
    ).toBeTruthy();

    const wateringIntervalDropdown = screen.getByTestId(
      "wateringIntervalDropdown",
    );
    expect(wateringIntervalDropdown).toBeTruthy();
  });
});

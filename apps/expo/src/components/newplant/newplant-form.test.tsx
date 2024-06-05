import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react-native";

import NewPlantForm from "./newplant-form";

jest.mock("@clerk/clerk-expo", () => ({
  useAuth: jest.fn(() => ({ userId: "mock-user-id", isLoaded: true })),
}));

jest.mock("~/utils/api", () => ({
  api: {
    plant: {
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

describe("NewPlantForm", () => {
  it("should render the form and allow user input", async () => {
    render(<NewPlantForm />);

    const nameInput = screen.getByTestId("nameInput");
    expect(nameInput).toBeTruthy();
    await act(async () => fireEvent.changeText(nameInput, "New Plant"));
    expect(screen.getByDisplayValue("New Plant")).toBeTruthy();

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

    const datePickerButton = screen.getByTestId("datePickerButton");
    expect(datePickerButton).toBeTruthy();

    expect(
      screen.getByText(
        new Date().toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
      ),
    ).toBeTruthy();
  });
});

import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { Plant } from "@arozvit/validators";

import ActionCard from "./action-card";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock("~/components/ui/delete-button", () => ({
  __esModule: true,
  default: jest.fn(() => <button role="button">Supprimer</button>),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: () => [true, jest.fn()],
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

describe("ActionCard", () => {
  it("should render the card with plant details and buttons", () => {
    render(<ActionCard plant={plantObj} />);

    const title = screen.getByText("Actions et paramètres");
    expect(title).toBeTruthy();

    const editButton = screen.getByText("Modifier la plante");
    expect(editButton).toBeTruthy();

    const deleteButton = screen.findByText("Supprimer");
    expect(deleteButton).toBeTruthy();
  });

  it("should call router.push on edit button press", () => {
    const mockPush = jest.fn();
    router.push = mockPush;

    render(<ActionCard plant={plantObj} />);

    const editButton = screen.getByText("Modifier la plante");
    fireEvent.press(editButton);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(`/myplants/${plantObj.id}/edit`);
  });

  it("should render loading indicator while deleting", () => {
    render(<ActionCard plant={plantObj} />);

    const loadingIndicator = screen.getByTestId("loading-indicator");
    expect(loadingIndicator).toBeTruthy();
  });
});

import { Alert } from "react-native";
import { act, fireEvent, render, screen } from "@testing-library/react-native";

import { Plant } from "@planty/validators";

import { api } from "~/utils/api";
import DeleteButton from "./delete-button";

jest.mock("~/utils/api", () => ({
  api: {
    plant: {
      delete: {
        useMutation: jest.fn(() => ({
          mutate: jest.fn(),
          isPending: false,
        })),
      },
    },

    useUtils: jest.fn().mockReturnValue({
      plant: {
        getPlantsWithWateringNeed: jest
          .fn()
          .mockResolvedValue(Promise.resolve()),
        get: jest.fn().mockResolvedValue(Promise.resolve()),
        getPlantByWateringDay: jest.fn().mockResolvedValue(Promise.resolve()),
        getBySearchTerm: jest.fn().mockResolvedValue(Promise.resolve()),
      },
    }),
  },
}));

jest.mock("react-native-root-toast", () => ({
  show: jest.fn(),
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
};

describe("DeleteButton component", () => {
  let mockMutate: unknown;

  beforeEach(() => {
    mockMutate = jest.fn();

    (api.plant.delete.useMutation as jest.Mock).mockReturnValueOnce({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it("renders the button correctly with text", async () => {
    render(
      <DeleteButton
        plant={{ ...plantObj }}
        setIsLoading={() => console.log()}
      />,
    );
    expect(screen.getByText("Supprimer")).toBeTruthy();
    expect(() => screen.getByTestId("delete-icon")).toThrow();
  });

  it("renders the button correctly with icon", async () => {
    render(
      <DeleteButton
        isIcon
        plant={{ ...plantObj }}
        setIsLoading={() => console.log()}
      />,
    );
    expect(screen.getByTestId("delete-icon")).toBeTruthy();
    expect(() => screen.getByText("Supprimer")).toThrow();
  });

  it("shows a confirmation alert on button press", async () => {
    const { getByText } = render(
      <DeleteButton
        plant={{ ...plantObj }}
        setIsLoading={() => console.log()}
      />,
    );
    const alert = jest.spyOn(Alert, "alert");

    await act(async () => {
      fireEvent.press(getByText("Supprimer"));
    });

    expect(alert).toHaveBeenCalledWith(
      "Attention",
      "La suppression de la plante est définitive, êtes-vous sûr de vouloir continuer ?",
      expect.any(Array),
      expect.any(Object),
    );
  });

  it("Should open an alert on click", async () => {
    const plant = { id: "1", name: "My Plant" };
    const { getByTestId } = render(
      <DeleteButton
        setIsLoading={() => console.log()}
        plant={{ ...plantObj, ...plant }}
      />,
    );

    const mockOnPress = jest.fn();

    Alert.alert("Title", "Message", [
      { text: "Supprimer", onPress: mockOnPress },
    ]);

    await act(async () => {
      fireEvent.press(getByTestId("delete-button"));
    });

    expect(Alert.alert).toHaveBeenCalled();
  });
});

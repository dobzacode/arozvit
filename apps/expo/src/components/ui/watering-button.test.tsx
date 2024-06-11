import { act, fireEvent, render, screen } from "@testing-library/react-native";
import moment from "moment";

import { Plant } from "@planty/validators";

import { api } from "~/utils/api";
import WateringButton from "./watering-button";

// Mock necessary imports (replace with your actual implementations)
jest.mock("~/utils/api", () => ({
  api: {
    plant: {
      waterPlant: {
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
  species: "species",
};

describe("WateringButton component", () => {
  let mockMutate: unknown;

  beforeEach(() => {
    mockMutate = jest.fn();

    (api.plant.waterPlant.useMutation as jest.Mock).mockReturnValueOnce({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it("renders the button correctly with text", async () => {
    render(
      <WateringButton
        plant={{ ...plantObj, lastWatering: moment().toDate() }}
        setIsLoading={() => console.log()}
      />,
    );
    expect(screen.getByText("Marquer comme arrosé")).toBeTruthy();
    expect(() => screen.getByTestId("watering-icon")).toThrow();
  });

  it("renders the button correctly with icon", async () => {
    render(
      <WateringButton
        isIcon={true}
        plant={{ ...plantObj, lastWatering: moment().toDate() }}
        setIsLoading={() => console.log()}
      />,
    );
    expect(screen.getByTestId("watering-icon")).toBeTruthy();
    expect(() => screen.getByText("Marquer comme arrosé")).toThrow();
  });

  it("calls the mutate function with the correct arguments on button press", async () => {
    const plant = { id: "1", name: "My Plant" };
    const date = moment().toDate();
    const { getByTestId } = render(
      <WateringButton
        date={date}
        plant={{ ...plantObj, ...plant }}
        setIsLoading={() => console.log()}
      />,
    );

    await act(async () => fireEvent.press(getByTestId("watering-button")));

    expect(mockMutate).toHaveBeenCalledWith({
      id: plant.id,
      lastWatering: date,
    });
  });
});

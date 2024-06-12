import { render, screen } from "@testing-library/react-native";
import moment from "moment";

import { Plant } from "@planty/validators";

import PlantCard from "./plant-card";

jest.doMock("moment-timezone", () => {
  const moment = () => ({
    format: () => {},
  });

  moment.tz = {
    setDefault: () => {},
  };

  return moment;
});

jest.mock("~/utils/api", () => ({
  api: {
    plant: {
      get: {
        useQuery: jest.fn(() => ({
          isLoading: false,
          isError: false,
          data: [
            {
              id: 1,
              name: "My Plant",
              nextWatering: new Date("2024-07-10"),
            },
          ],
        })),
      },
    },
  },
}));

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

describe("PlantCard", () => {
  it("renders the plant card with the correct data", async () => {
    render(<PlantCard plant={mockPlant} index={1} />);
    expect(
      screen.getByText("Nécessite un arrosage depuis le 02/06/2024"),
    ).toBeTruthy();
    expect(screen.getByText("Plant 2")).toBeTruthy();
  });

  it("renders the plant card with good formating", async () => {
    render(
      <PlantCard
        plant={{ ...mockPlant, nextWatering: moment().add(1, "year").toDate() }}
        index={4}
      />,
    );
    expect(
      screen.getByText(
        `Prochain arrosage le ${moment().add(1, "year").format("DD/MM/YYYY")}`,
      ),
    ).toBeTruthy();
  });

  it("renders water icon if watering date is due", async () => {
    render(
      <PlantCard
        plant={{
          ...mockPlant,
          nextWatering: moment().subtract(1, "year").toDate(),
        }}
        index={4}
      />,
    );
    expect(screen.getByTestId(`water-icon`)).toBeTruthy();
  });
});

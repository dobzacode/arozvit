import { render, screen } from "@testing-library/react-native";

import { api } from "~/utils/api";
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

describe("PlantCard", () => {
  it("renders the plant card with the correct data", async () => {
    (api.plant.get.useQuery as jest.Mock).mockReturnValueOnce({
      isLoading: false,
      isError: false,
      data: [
        {
          id: 2,
          name: "My Plant 2",
          nextWatering: new Date("2024-07-10"),
        },
      ],
    });
    render(<PlantCard plant="2" />);
    expect(screen.getByText("Prochain arrosage le 10/07/2024")).toBeTruthy();
    expect(screen.getByText("My Plant 2")).toBeTruthy();
  });
});

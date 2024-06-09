import { render, screen } from "@testing-library/react-native";

import PlantCardSnippet from "./plant-card-snippet";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: (initialValue: unknown) => [initialValue, jest.fn()],
}));

jest.doMock("moment", () => {
  const moment = () => ({
    format: () => {},
  });

  moment.tz = {
    setDefault: () => {},
  };

  return moment;
});

jest.mock("../../../ui/watering-button.tsx", () => () => {
  //@ts-expect-error mock component
  return <mock-watering-button data-testid="mock-watering-button" />;
});

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
  },
}));

describe("PlantCardSnippet", () => {
  it("renders the plant card with the correct data", async () => {
    render(
      <PlantCardSnippet
        plant={{
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
        }}
      />,
    );
    expect(screen.getByText("Prochain arrosage le 02/06/2024")).toBeTruthy();
    expect(screen.getByText("Plant 2")).toBeTruthy();
  });
});

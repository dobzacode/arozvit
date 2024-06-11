import { render, screen } from "@testing-library/react-native";
import moment from "moment";

import { Plant } from "@planty/validators";

import { firstLetterCapitalize } from "~/utils/utils";
import MainCard from "./main-card";

jest.mock("@planty/validators", () => ({
  Plant: jest.fn(() => ({})),
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

jest.doMock("moment-timezone", () => {
  const moment = () => ({
    format: () => {},
  });

  moment.tz = {
    setDefault: () => {},
  };

  return moment;
});

describe("MainCard", () => {
  it("should render the card with plant information", () => {
    render(<MainCard plant={plantObj} />);

    const plantName = screen.getByText(firstLetterCapitalize(plantObj.name));
    expect(plantName).toBeTruthy();

    const plantSpecies = screen.getByText(
      //@ts-expect-error species is passed as a string
      firstLetterCapitalize(plantObj.species),
    );
    expect(plantSpecies).toBeTruthy();

    const addedDate = screen.getByText(
      `Ajouté le ${moment(plantObj.createdAt).tz("Europe/Paris").format("DD/MM/YYYY")}`,
    );
    expect(addedDate).toBeTruthy();

    const image = screen.getByTestId("image");
    expect(image).toBeTruthy();
  });

  it("should handle missing species information", () => {
    render(<MainCard plant={{ ...plantObj, species: null }} />);

    const plantName = screen.getByText(firstLetterCapitalize(plantObj.name));
    expect(plantName).toBeTruthy();

    expect(() => screen.getByTestId("species")).toThrow();
  });
});

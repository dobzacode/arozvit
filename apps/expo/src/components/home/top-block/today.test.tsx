import { render } from "@testing-library/react-native";

import { Plant } from "@arozvit/validators";

import Today from "./today";

describe("Today component", () => {
  it("renders the correct information for one plant needing water", () => {
    const plants = [
      { name: "Plant A", nextWatering: new Date() }, // Needs watering today
    ];
    const { getByText } = render(<Today plants={plants as Plant[]} />);

    expect(getByText("Aujourd'hui")).toBeTruthy();
    expect(
      getByText("1 plante a un arrosage prévu pour aujourd'hui"),
    ).toBeTruthy();
    expect(getByText("Accéder à cette plante")).toBeTruthy();
  });

  it("renders the correct information for multiple plants needing water", () => {
    const plants = [
      { name: "Plant A", nextWatering: new Date() },
      { name: "Plant B", nextWatering: new Date() },
    ];
    const { getByText } = render(<Today plants={plants as Plant[]} />);

    expect(getByText("Aujourd'hui")).toBeTruthy();
    expect(
      getByText("2 plantes ont un arrosage prévu pour aujourd'hui"),
    ).toBeTruthy();
    expect(getByText("Accéder à ces plantes")).toBeTruthy();
  });

  it("does not render if no plants need watering today", () => {
    const plants = [
      { name: "Plant A", nextWatering: new Date(2023, 6, 11, 1) },
    ];
    const { getByText } = render(<Today plants={plants as Plant[]} />);

    expect(() => getByText("Aujourd'hui")).toThrow();
  });
});

import { render, screen } from "@testing-library/react-native";
import moment from "moment-timezone";

import { Plant } from "@planty/validators";

import Notifications from "./notifications";

const MockView = () => <div />;

jest.mock("~/components/ui/watering-button", () => ({
  __esModule: true,
  default: () => <MockView />,
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: (initialValue: unknown) => [initialValue, jest.fn()],
}));

describe("Notifications component", () => {
  it("renders notification for the plant needing water", () => {
    const plants = [
      { name: "Plant A", nextWatering: new Date(2024, 3, 10) },
      { name: "Plant B", nextWatering: new Date(2024, 4, 15) },
    ];
    const { getByText, getByTestId } = render(
      <Notifications plants={plants as Plant[]} />,
    );

    expect(getByText("Plant B")).toBeTruthy();
    expect(getByTestId("Plant B-notification")).toBeTruthy();
  });

  it("does not render notification if no plants need watering", () => {
    const plants = [
      { name: "Plant A", nextWatering: moment().add("years", 1).toDate() },
      { name: "Plant B", nextWatering: moment().add("years", 1).toDate() },
    ];

    const { getByText } = render(<Notifications plants={plants as Plant[]} />);
    screen.debug();
    expect(() => getByText("Plant B")).toThrow();
  });
});

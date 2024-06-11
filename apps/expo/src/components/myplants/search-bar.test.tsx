import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import SearchBar from "./search-bar";

describe("SearchBar component", () => {
  const mockSetSearchTerm = jest.fn();

  it("renders the search icon and placeholder text", () => {
    const { getByDisplayValue, getByTestId, getByPlaceholderText } = render(
      <SearchBar
        colorScheme={"light"}
        setSearchTerm={mockSetSearchTerm}
        searchTerm=""
      />,
    );

    const input = getByTestId("search-input");

    expect(getByTestId("search-icon")).toBeTruthy();
    expect(getByPlaceholderText("Rechercher une plante")).toBeTruthy();
  });

  it("updates the search term when user types", () => {
    const { getByTestId } = render(
      <SearchBar
        colorScheme={"light"}
        searchTerm=""
        setSearchTerm={mockSetSearchTerm}
      />,
    );

    const input = getByTestId("search-input");
    fireEvent.changeText(input, "test");

    expect(mockSetSearchTerm).toHaveBeenCalledWith("test");
  });
});

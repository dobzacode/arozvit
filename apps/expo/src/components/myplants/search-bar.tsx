import React from "react";
import { TextInput, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

export default function SearchBar({
  setSearchTerm,
  searchTerm,
  colorScheme,
}: {
  setSearchTerm: (term: string) => void;
  searchTerm: string;
  colorScheme: "dark" | "light" | null | undefined;
}) {
  return (
    <View
      className={`input-neutral  flex-row items-center gap-md rounded-xs px-md py-sm shadow-sm shadow-black`}
    >
      <View testID="search-icon">
        <FontAwesome6
          name="magnifying-glass"
          size={16}
          color={colorScheme === "dark" ? "white" : "black"}
        />
      </View>
      <TextInput
        testID="search-input"
        selectionColor={"hsl(100, 36%, 40%)"}
        className="body relative z-20 w-full placeholder:text-neutral-900/[0.4] dark:bg-neutral-900 dark:text-surface dark:placeholder:text-neutral-100/[0.8]"
        placeholder="Rechercher une plante"
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
      />
    </View>
  );
}

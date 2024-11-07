import { Button, Input } from "@rneui/themed";
import React, { FC, useState } from "react";
import { View, StyleSheet } from "react-native";

type SearchItemProps = {
  onSearch: (query: string) => void;
};

const SearchItem: FC<SearchItemProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Input placeholder="Buscar..." value={query} onChangeText={setQuery} />
      </View>
      <Button
        title="Buscar"
        color="#8A4C0B"
        radius={"lg"}
        onPress={handleSearch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
  },
  leftContainer: {
    flex: 1,
    justifyContent: "center",
    marginLeft: -10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8A4C0B",
  },
  rightContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});

export default SearchItem;

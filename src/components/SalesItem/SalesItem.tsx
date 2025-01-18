import React, { FC } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Button, Icon } from "@rneui/themed";

type Sales = {
  id: number;
  description: string;
  date: string;
  price: number;
};

type SalesItemProps = {
  sales: Sales[];
  onDelete: (id: number) => void;
};

const SalesItem: FC<SalesItemProps> = ({ sales, onDelete }) => {
  const renderItem = ({ item }: { item: Sales }) => (
    <View style={styles.container}>
      <View key={item.id} style={styles.leftContainer}>
        <Text style={styles.name}>{item.description}</Text>
        <Text style={styles.info}>Fecha: {item.date}</Text>
        <Text style={styles.info}>Valor: {item.price.toFixed(3)}</Text>
      </View>
      <View style={styles.rightContainer}>
        <Button
          icon={<Icon name="delete" color="#8A4C0B" />}
          type="clear"
          color="#8A4C0B"
          onPress={() => onDelete(item.id)}
        />
      </View>
    </View>
  );

  return (
    <FlatList
      data={sales}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No items para mostrar</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#f4ccbb",
    borderRadius: 12,
    marginHorizontal: 12,
    marginBottom: 7,
    flexDirection: "row",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8A4C0B",
  },
  info: {
    fontSize: 16,
    color: "#555",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#aaa",
  },
  leftContainer: {
    flex: 1,
    justifyContent: "center",
  },
  rightContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
});

export default SalesItem;

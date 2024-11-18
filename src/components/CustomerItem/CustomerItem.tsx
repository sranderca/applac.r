import React, { FC } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Button, Icon } from "@rneui/themed";

type Customer = {
  id: number;
  name: string;
  phoneNumber: string;
  address: string;
};

type CustomerItemProps = {
  customers: Customer[];
  onDelete: (id: number) => void;
};

const CustomerItem: FC<CustomerItemProps> = ({ customers, onDelete }) => {
  const renderItem = ({ item }: { item: Customer }) => (
    <View style={styles.container}>
      <View key={item.id} style={styles.leftContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.info}>Teléfono: {item.phoneNumber}</Text>
        <Text style={styles.info}>Dirección: {item.address}</Text>
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
      data={customers}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No hay clientes para mostrar</Text>
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

export default CustomerItem;

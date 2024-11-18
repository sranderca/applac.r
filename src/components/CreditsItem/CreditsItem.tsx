import React, { FC, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Button, Icon } from "@rneui/themed";
import CreditDetailModal from "../CreditDetailModal"

type Credit = {
  id: number;
  customerName: string; // Nombre del cliente asociado al crédito
  date: string;
  price: number;
  description: string;
  initialFee: number;
};

type CreditsItemProps = {
  credits: Credit[];
  onDeleteCredit: () => void
};

const CreditsItem: FC<CreditsItemProps> = ({ credits, onDeleteCredit }) => {
  const [selectedCredit, setSelectedCredit] = useState<Credit | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const openModal = (credit: Credit) => {
    setSelectedCredit(credit);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedCredit(null);
    onDeleteCredit()
  };

  const renderItem = ({ item }: { item: Credit }) => (
    <View style={styles.container}>
      <View key={item.id} style={styles.leftContainer}>
        <Text style={styles.name}>{item.customerName}</Text>
        <Text style={styles.info}>Fecha: {item.date}</Text>
        <Text style={styles.info}>Valor: ${item.price.toFixed(3)}</Text>
        <Text style={styles.info}>
          Cuota Inicial: ${item.initialFee.toFixed(3)}
        </Text>
        <Text style={styles.info}>Descripción: {item.description}</Text>
      </View>
      <View style={styles.rightContainer}>
        <Button
          icon={<Icon name="add-circle-outline" color={"#8A4C0B"} />}
          color="#f4ccbb"
          onPress={() => openModal(item)}
        />
      </View>
    </View>
  );

  return (
    <>
      <FlatList
        data={credits}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay créditos para mostrar</Text>
        }
      />
      {selectedCredit && (
        <CreditDetailModal
          visible={isModalVisible}
          onClose={closeModal}
          credit={selectedCredit}
        />
      )}
    </>
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
  leftContainer: {
    flex: 1,
  },
  rightContainer: {
    justifyContent: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8A4C0B",
  },
  info: {
    color: "#555",
    fontSize: 16
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#8A4C0B",
  },
});

export default CreditsItem;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import Header from "../../components/Header";
import { getFilteredMovements } from "../../hooks/database";

const timeFilters = [
  { label: "Hoy", value: "today" },
  { label: "Ayer", value: "yesterday" },
  { label: "Últimos 3 días", value: "last3days" },
  { label: "Última semana", value: "last7days" },
  { label: "Último mes", value: "last30days" },
];

const Home = () => {
  const [selectedFilter, setSelectedFilter] = useState("today");
  const [movements, setMovements] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getFilteredMovements(selectedFilter, setMovements);
  }, [selectedFilter]);

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>Movimientos</Text>
      </View>
      <View style={styles.containerFilter}>
        <View style={styles.leftContainer}>
          <Text style={styles.text}>Filtrar Por </Text>
        </View>
        <View style={styles.rightContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.filterText}>
              {timeFilters.find((f) => f.value === selectedFilter)?.label}
            </Text>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {timeFilters.map((filter) => (
                <TouchableOpacity
                  key={filter.value}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedFilter(filter.value);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalText}>{filter.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          data={movements}
          keyExtractor={(item, index) => item.type + (item.id ?? index)} // <-- Usamos index si id es undefined
          renderItem={({ item }) => (
            <View style={styles.containerItem}>
              <View style={styles.leftContainerItem}>
                <Text
                  style={{ fontWeight: "bold", fontSize: 20, color: "#8A4C0B" }}
                >
                  {item.description}
                </Text>
                <Text style={styles.info}>{item.date}</Text>
                <Text style={styles.info}>
                  Valor: ${item.amount.toFixed(3)}
                </Text>
              </View>
              <View style={styles.rightContainerItem}>
                <Text style={{ fontSize: 16, color: "#555" }}>{item.type}</Text>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 12,
    alignItems: "center",
  },
  containerFilter: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  leftContainer: {
    flex: 1,
    justifyContent: "center",
  },
  rightContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  filterButton: {
    padding: 10,
    backgroundColor: "#8A4C0B",
    borderRadius: 10,
    justifyContent: "center",
  },
  filterText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "75%",
    maxHeight: "70%",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    elevation: 5,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f4ccbb",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8A4C0B",
  },
  containerItem: {
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 7,
    borderRadius: 12,
    backgroundColor: "#f4ccbb",
    flexDirection: "row",
  },
  leftContainerItem: {
    justifyContent: "center",
  },
  rightContainerItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#8A4C0B",
  },
  info: {
    fontSize: 16,
    color: "#555",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8A4C0B",
  },
});

export default Home;

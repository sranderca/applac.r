import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import Header from "../../components/Header";
import { getMonthlySummary } from "../../hooks/database";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const filters = [
  { label: "Ultimo Mes", value: "lastMonth" },
  { label: "Anterior Mes", value: "prevMonth" },
];

const screenWidth = Dimensions.get("window").width;

const Summary = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [activeCredits, setActiveCredits] = useState(0);
  const [outBalance, setOutBalance] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("lastMonth");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchSummaryData();
  }, [selectedFilter]);

  useFocusEffect(
    useCallback(() => {
      fetchSummaryData();
    }, [selectedFilter])
  );

  const fetchSummaryData = () => {
    const today = new Date();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();

    if (selectedFilter === "prevMonth") {
      month -= 1;
      if (month === 0) {
        month = 12;
        year -= 1;
      }
    }

    getMonthlySummary(month, year, (data) => {
      setTotalRevenue(data.totalIncome);
      setTotalExpenses(data.totalExpenses);
      setNetProfit(data.totalIncome - data.totalExpenses);
      setActiveCredits(data.activeCredits);
      setOutBalance(data.pendingBalance);
    });
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <View style={styles.filter}>
          <View style={styles.leftContainer}>
            <Text style={styles.text}>Filtrar Por</Text>
          </View>
          <View style={styles.rightContainer}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.filterText}>
                {filters.find((f) => f.value === selectedFilter)?.label}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {filters.map((filter) => (
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
        <View style={styles.details}>
          <SummaryRow
            label="Ingresos Totales        "
            value={totalRevenue.toFixed(3)}
          />
          <SummaryRow
            label="Egresos Totales"
            value={totalExpenses.toFixed(3)}
          />
          <SummaryRow label="Ganancia Neta" value={netProfit.toFixed(3)} />
          <SummaryRow label="Créditos Activos" value={activeCredits} />
          <SummaryRow label="Saldo Pendiente" value={outBalance.toFixed(3)} />
        </View>

        <BarChart
          data={{
            labels: ["Ingresos", "Egresos"],
            datasets: [{ data: [totalRevenue, totalExpenses] }],
          }}
          width={screenWidth - 40}
          height={220}
          yAxisLabel="$"
          yAxisSuffix="" // 🔥 Agregado para evitar el error
          chartConfig={{
            backgroundColor: "#f4f4f4",
            backgroundGradientFrom: "#f4f4f4",
            backgroundGradientTo: "#f4f4f4",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            barPercentage: 0.6,
          }}
          style={{ marginVertical: 10, borderRadius: 10 }}
        />
      </View>
    </View>
  );
};

const SummaryRow = ({ label, value }) => (
  <View style={styles.summaryRow}>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={styles.summaryValue}>{value.toLocaleString()}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 12,
    alignItems: "center",
  },
  filter: {
    flexDirection: "row",
  },
  leftContainer: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8A4C0B",
  },
  rightContainer: {
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
  details: { marginTop: 20 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  summaryLabel: { fontSize: 16, fontWeight: "bold", color: "#8A4C0B" },
  summaryValue: { fontSize: 16 },
});

export default Summary;

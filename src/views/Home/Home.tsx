import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../../components/Header";

const Home = () => {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>Movimientos</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#8A4C0B",
  },
});

export default Home;

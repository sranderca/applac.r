import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "../../components/Header";
import AddItem from "../../components/AddItem";
import SearchItem from "../../components/SearchItem";

const Revenue = () => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");

  const fields = [
    { label: "Descripcion", value: description, setValue: setDescription },
    { label: "Fecha", value: date, setValue: setDate },
    { label: "Valor", value: price, setValue: setPrice },
  ];

  return (
    <View style={styles.container}>
      <Header />
      <AddItem text="Añadir Ingreso" fields={fields} type="revenue" />
      <SearchItem />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Revenue;

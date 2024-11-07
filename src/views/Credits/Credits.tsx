import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Header from "../../components/Header";
import AddItem from "../../components/AddItem";
import SearchItem from "../../components/SearchItem";

const Credits = () => {
  const [customer, setCustomer] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [initialFee, setInitialFee] = useState("");

  const fields = [
    { label: "Cliente", value: customer, setValue: setCustomer },
    { label: "Fecha", value: date, setValue: setDate },
    { label: "Valor", value: price, setValue: setPrice },
    { label: "Descripcion", value: description, setValue: setDescription },
    { label: "C/Inicial", value: initialFee, setValue: setInitialFee },
  ];

  return (
    <View style={styles.container}>
      <Header />
      <AddItem text="Añadir Credito" fields={fields} type="credits" />
      <SearchItem />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Credits;

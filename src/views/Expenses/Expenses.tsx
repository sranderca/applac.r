import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Header from "../../components/Header";
import AddItem from "../../components/AddItem";
import { deleteExpenses, getExpenses } from "../../hooks/database";
import SalesItem from "../../components/SalesItem";

const Expenses = () => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [expenses, setExpenses] = useState([]);

  const fields = [
    { label: "Descripcion", value: description, setValue: setDescription },
    { label: "Fecha", value: date, setValue: setDate },
    { label: "Valor", value: price, setValue: setPrice },
  ];

  const loadExpenses = () => {
    getExpenses((data) => {
      setExpenses(data);
    });
  };

  const handleDeleteExpenses = (id) => {
    deleteExpenses(id, () => {
      console.log("Gasto eliminada con éxito");
      loadExpenses();
    });
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <AddItem
        text="Añadir Egreso"
        fields={fields}
        type="expenses"
        onAddSucces={loadExpenses}
      />
      <SalesItem sales={expenses} onDelete={handleDeleteExpenses} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

export default Expenses;

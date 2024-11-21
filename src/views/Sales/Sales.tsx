import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Header from "../../components/Header";
import AddItem from "../../components/AddItem";
import { deleteSales, getSales } from "../../hooks/database";
import SalesItem from "../../components/SalesItem";


const Sales = () => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [sales, setSales] = useState([]);

  const fields = [
    { label: "Descripcion", value: description, setValue: setDescription },
    { label: "Fecha", value: date, setValue: setDate },
    { label: "Valor", value: price, setValue: setPrice },
  ];

  const loadSales = () => {
    getSales((data) => {
      setSales(data);
    });
  };

  const handleDeleteSales = (id) => {
    deleteSales(id, () => {
      console.log("Venta eliminada con éxito");
      loadSales(); // Recargar los clientes después de eliminar
    });
  };

  useEffect(() => {
    loadSales();
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <AddItem
        text="Añadir Venta"
        fields={fields}
        type="sales"
        onAddSucces={loadSales}
      />
      <SalesItem sales={sales} onDelete={handleDeleteSales} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Sales;

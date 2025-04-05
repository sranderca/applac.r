import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Header from "../../components/Header";
import AddItem from "../../components/AddItem";
import { deleteRevenues, getRevenues } from "../../hooks/database";
import SalesItem from "../../components/SalesItem";

const Revenue = () => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [revenues, setRevenues] = useState([]);

  const fields = [
    { label: "Descripcion", value: description, setValue: setDescription },
    { label: "Fecha", value: date, setValue: setDate },
    { label: "Valor", value: price, setValue: setPrice },
  ];

  const loadRevenues = () => {
    getRevenues((data) => {
      setRevenues(data);
    });
  };

  useEffect(() => {
    loadRevenues();
  }, []);

  const handleDeleteRevenues = (id) => {
    deleteRevenues(id, () => {
      console.log("Ingreso eliminado con exito");
      loadRevenues();
    });
  };

  return (
    <View style={styles.container}>
      <Header />
      <AddItem
        text="Añadir Inversion"
        fields={fields}
        type="revenues"
        onAddSucces={loadRevenues}
      />
      <SalesItem sales={revenues} onDelete={handleDeleteRevenues} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

export default Revenue;

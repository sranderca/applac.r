import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Header from "../../components/Header";
import AddItem from "../../components/AddItem";
import SearchItem from "../../components/SearchItem";
import { getCustomers, getCredits } from "../../hooks/database";
import CreditsItem from "../../components/CreditsItem";
import { useNavigation } from "@react-navigation/native";

const Credits = () => {
  const [customers, setCustomers] = useState([]);
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [initialFee, setInitialFee] = useState("");
  const [credits, setCredits] = useState([]);
  const navigation = useNavigation();
  const [filteredCredits, setFilteredCredits] = useState([]);

  const loadCredits = () => {
    getCredits((data) => {
      setCredits(data);
      setFilteredCredits(data); 
    });
  };

  const loadCustomers = () => {
    getCustomers((data) => {
      setCustomers(data);
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadCustomers();
    });

    loadCredits();
    loadCustomers();

    return unsubscribe;
  }, [navigation]);

  const handleSearch = (query) => {
    if (query === "") {
      setFilteredCredits(credits); // Mostrar todos los créditos si no hay búsqueda
    } else {
      const filtered = credits.filter((credit) =>
        credit.customerName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCredits(filtered);
    }
  };

  const fields = [
    { label: "Fecha", value: date, setValue: setDate },
    { label: "Valor", value: price, setValue: setPrice },
    { label: "Descripcion", value: description, setValue: setDescription },
    { label: "C/Inicial", value: initialFee, setValue: setInitialFee },
  ];

  return (
    <View style={styles.container}>
      <Header />
      <AddItem
        text="Añadir Credito"
        fields={fields}
        type="credits"
        customers={customers}
        onAddSucces={loadCredits}
      />
      <SearchItem onSearch={handleSearch} />
      <CreditsItem credits={filteredCredits} onDeleteCredit={loadCredits} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Credits;

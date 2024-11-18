import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Header from "../../components/Header";
import AddItem from "../../components/AddItem";
import SearchItem from "../../components/SearchItem";
import { getCustomers } from "../../hooks/database";
import { deleteCustomer } from "../../hooks/database";
import CustomerItem from "../../components/CustomerItem";

const Customers = () => {
  const [name, setName] = useState("");
  const [adress, setAdress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const fields = [
    { label: "Nombre", value: name, setValue: setName },
    { label: "Telefono", value: phoneNumber, setValue: setPhoneNumber },
    { label: "Direccion", value: adress, setValue: setAdress },
  ];

  const loadCustomers = () => {
    getCustomers((data) => {
      setCustomers(data);
      setFilteredCustomers(data);
    });
  };

  const handleSearch = (query) => {
    const filtered = customers.filter((customer) => {
      return customer.name.toLowerCase().includes(query.toLowerCase());
    });
    setFilteredCustomers(filtered);
  };

  const handleDeleteCustomer = (id) => {
    deleteCustomer(id, () => {
      console.log("Cliente eliminado con éxito");
      loadCustomers(); // Recargar los clientes después de eliminar
    });
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <AddItem
        text="Añadir Cliente"
        fields={fields}
        type="customers"
        onAddSucces={loadCustomers}
      />
      <SearchItem onSearch={handleSearch} />
      <CustomerItem
        customers={filteredCustomers}
        onDelete={handleDeleteCustomer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Customers;

import React, { useState, useEffect } from "react";
import { View, Text, Modal, StyleSheet, FlatList, Alert } from "react-native";
import {
  addCreditAddition,
  addPayment,
  deleteCredit,
  getCreditAdditions,
  getPaymentsByCreditId,
  updateCreditBalance,
  updateCreditStatus,
} from "../../hooks/database";
import { Icon, Button, Input } from "@rneui/themed";

const CreditDetailModal = ({ visible, onClose, credit }) => {
  const getCurrentDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Mes con dos dígitos
    const day = String(today.getDate()).padStart(2, "0"); // Día con dos dígitos
    return `${year}-${month}-${day}`;
  };

  const [isAddPaymentVisible, setIsAddPaymentVisible] = useState(false);
  const [isEditCreditVisible, setIsEditCreditVisible] = useState(false);
  const [payments, setPayments] = useState([]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(getCurrentDate());
  const [newBalance, setNewBalance] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDate, setNewDate] = useState(getCurrentDate());
  const [additions, setAdditions] = useState([]);
  const [localCredit, setLocalCredit] = useState(credit);

  // Traer los abonos
  useEffect(() => {
    setLocalCredit(credit);

    if (credit) {
      getPaymentsByCreditId(credit.id, setPayments);
      getCreditAdditions(credit.id, (data) => {
        setAdditions(data);
      });
    }
  }, [credit]);

  const handleAddPayment = () => {
    const paymentDate = date || new Date().toISOString().split("T")[0]; // Fecha actual si no se ingresa
    const paymentAmount = parseFloat(amount);

    addPayment(credit.id, paymentDate, paymentAmount, note, () => {
      // Actualizar el saldo del crédito
      const newBalance = localCredit.balance - paymentAmount;

      updateCreditBalance(credit.id, newBalance, () => {
        Alert.alert("Abono añadido");
        setAmount("");
        setNote("");
        setDate("");

        getPaymentsByCreditId(credit.id, setPayments);

        //Actualiza el crédito local
        setLocalCredit({ ...localCredit, balance: newBalance });

        setIsAddPaymentVisible(false);

        if (newBalance <= 0) {
          updateCreditStatus(credit.id, "inactivo");
        }
      });
    });
  };

  const handleDeleteCredit = () => {
    Alert.alert(
      "Eliminar Crédito",
      "Estás seguro de eliminar este crédito? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: () => {
            deleteCredit(credit.id, () => {
              Alert.alert("Crédito Eliminado");
              onClose();
            });
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleUpdateCredit = () => {
    addCreditAddition(
      credit.id,
      newDescription,
      newDate,
      parseFloat(newBalance),
      () => {
        const updatedBalance = localCredit.balance + parseFloat(newBalance);

        //Actualiza el crédito local
        setLocalCredit({ ...localCredit, balance: updatedBalance });

        getCreditAdditions(credit.id, setAdditions);
        setNewDescription("");
        setNewDate("");
        setNewBalance("");
        setIsEditCreditVisible(false);
      }
    );
  };

  const formatCurrency = (value: string): string => {
    const cleanedValue = value.replace(/\D/g, ""); // Elimina cualquier caracter que no sea número
    return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Añade los puntos de miles
  };

  const renderItem = ({ item }) => {
    if (item.type === "additionsTitle") {
      return <Text style={styles.sectionTitle}>Productos Agregados</Text>;
    } else if (item.type === "paymentsTitle") {
      return <Text style={styles.sectionTitle}>Abonos Realizados</Text>;
    } else if ("note" in item) {
      return (
        <View style={styles.paymentItem}>
          <Text style={styles.legend}>Fecha: {item.date}</Text>
          <Text style={styles.legend}>Valor: $ {item.amount.toFixed(3)}</Text>
          <Text style={styles.legend}>Nota: {item.note}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.additionItem}>
          <Text style={styles.legend}>Fecha: {item.date}</Text>
          <Text style={styles.legend}>Valor: $ {item.amount.toFixed(3)}</Text>
          <Text style={styles.legend}>Descripción: {item.description}</Text>
        </View>
      );
    }
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={() => onClose()}
      transparent
      animationType="slide"
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Detalle del Crédito</Text>
            </View>
            <View style={styles.closeContainer}>
              <Button
                icon={<Icon name="close" size={28} color={"#8A4C0B"} />}
                onPress={() => onClose()}
                type="clear"
              />
            </View>
          </View>

          <Text style={styles.legend}>Cliente: {localCredit.customerName}</Text>
          <Text style={styles.legend}>Fecha: {localCredit.date}</Text>
          <Text style={styles.legend}>
            Valor: $ {localCredit.price.toFixed(3)}
          </Text>
          <Text style={styles.legend}>
            Saldo: $ {localCredit.balance.toFixed(3)}
          </Text>
          <FlatList
            data={[
              { type: "additionsTitle" },
              ...additions,
              { type: "paymentsTitle" },
              ...payments,
            ]}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
          />

          <View style={styles.containerButtons}>
            <View style={styles.deleteContainer}>
              <Button
                icon={<Icon name="delete" color={"#fff"} />}
                radius={"lg"}
                color={"#8A4C0B"}
                onPress={handleDeleteCredit}
              />
            </View>
            <View>
              <Button
                icon={<Icon name="edit" color={"#fff"} />}
                radius={"lg"}
                color={"#8A4C0B"}
                onPress={() => setIsEditCreditVisible(true)}
              />
            </View>
            <View style={styles.addContainer}>
              <Button
                icon={<Icon name="add-circle-outline" color={"#fff"} />}
                radius={"lg"}
                color={"#8A4C0B"}
                onPress={() => setIsAddPaymentVisible(true)}
              />
            </View>
          </View>
          <Modal
            visible={isEditCreditVisible}
            onRequestClose={() => setIsEditCreditVisible(false)}
            transparent
            animationType="slide"
          >
            <View style={styles.containerModal}>
              <View style={styles.contentModal}>
                <View style={styles.headerModal}>
                  <View style={styles.leftContainer}>
                    <Text style={styles.title}>Añadir Producto</Text>
                  </View>
                  <View style={styles.rightContainer}>
                    <Button
                      icon={<Icon name="close" size={28} color={"#8A4C0B"} />}
                      onPress={() => setIsEditCreditVisible(false)}
                      type="clear"
                    />
                  </View>
                </View>
                <View style={styles.formItem}>
                  <View style={styles.inputContainer}>
                    <Input
                      value={newDate}
                      onChangeText={(text) => setNewDate(formatCurrency(text))} // Formatea el valor ingresado
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.legendContainer}>
                    <Text style={styles.legend}>Fecha</Text>
                  </View>
                </View>
                <View style={styles.formItem}>
                  <View style={styles.inputContainer}>
                    <Input
                      value={newBalance}
                      onChangeText={(text) =>
                        setNewBalance(formatCurrency(text))
                      } // Formatea el valor ingresado
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.legendContainer}>
                    <Text style={styles.legend}>Valor</Text>
                  </View>
                </View>
                <View style={styles.formItem}>
                  <View style={styles.inputContainer}>
                    <Input
                      value={newDescription}
                      onChangeText={(text) => {
                        setNewDescription(text);
                      }}
                    />
                  </View>
                  <View style={styles.legendContainer}>
                    <Text style={styles.legend}>Descripcion</Text>
                  </View>
                </View>
                <Button
                  title="Agregar"
                  onPress={handleUpdateCredit}
                  radius={10}
                  color={"#8A4C0B"}
                />
              </View>
            </View>
          </Modal>
          <Modal
            visible={isAddPaymentVisible}
            onRequestClose={() => setIsAddPaymentVisible(false)}
            transparent
            animationType="slide"
          >
            <View style={styles.containerModal}>
              <View style={styles.contentModal}>
                <View style={styles.headerModal}>
                  <View style={styles.leftContainer}>
                    <Text style={styles.title}>Añadir Abono</Text>
                  </View>
                  <View style={styles.rightContainer}>
                    <Button
                      icon={<Icon name="close" size={28} color={"#8A4C0B"} />}
                      onPress={() => setIsAddPaymentVisible(false)}
                      type="clear"
                    />
                  </View>
                </View>

                <View style={styles.formItem}>
                  <View style={styles.inputContainer}>
                    <Input value={date} onChangeText={setDate} />
                  </View>
                  <View style={styles.legendContainer}>
                    <Text style={styles.legend}>Fecha</Text>
                  </View>
                </View>
                <View style={styles.formItem}>
                  <View style={styles.inputContainer}>
                    <Input
                      value={amount}
                      onChangeText={(text) => setAmount(formatCurrency(text))} // Formatea el valor ingresado
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.legendContainer}>
                    <Text style={styles.legend}>Valor</Text>
                  </View>
                </View>
                <View style={styles.formItem}>
                  <View style={styles.inputContainer}>
                    <Input value={note} onChangeText={setNote} />
                  </View>
                  <View style={styles.legendContainer}>
                    <Text style={styles.legend}>Nota</Text>
                  </View>
                </View>
                <Button
                  title="Agregar"
                  onPress={handleAddPayment}
                  radius={10}
                  color={"#8A4C0B"}
                />
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    width: "75%",
    maxHeight: "70%",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
  },
  titleContainer: {
    flex: 2,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8A4C0B",
    marginBottom: 10,
  },
  closeContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  legend: {
    color: "#555",
    fontSize: 16,
  },
  subTitle: {
    fontSize: 20,
    color: "#8A4C0B",
    fontWeight: "bold",
    marginTop: 10,
  },
  paymentItem: {
    padding: 10,
    borderBottomWidth: 1,
  },
  input: {
    marginVertical: 10,
    borderWidth: 1,
    padding: 8,
  },
  containerButtons: {
    flexDirection: "row",
    marginTop: 10,
  },
  deleteContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  addContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  containerModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  contentModal: {
    width: "65%",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    elevation: 5,
  },
  headerModal: {
    flexDirection: "row",
  },
  leftContainer: {
    flex: 2,
    justifyContent: "center",
  },
  rightContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  formItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputContainer: {
    flex: 2,
  },
  legendContainer: {
    flex: 1,
  },
  button: {
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 8,
    textAlign: "center",
    color: "#8A4C0B",
  },
  additionItem: {
    backgroundColor: "#f1f8e9",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});

export default CreditDetailModal;

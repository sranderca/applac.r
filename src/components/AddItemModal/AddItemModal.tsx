import { Button, Icon, Input } from "@rneui/themed";
import React, { FC, useEffect, useState } from "react";
import { Modal, View, StyleSheet, Text } from "react-native";
import { addCustomer, addCredit } from "../../hooks/database";
import { Picker } from "@react-native-picker/picker";

type AddItemModalProps = {
  onClose: (shouldUpdate?: boolean) => void;
  visible: boolean;
  fields: Array<{
    label: string;
    value: string;
    setValue: (text: string) => void;
  }>;
  type: string;
  customers?: Array<{ id: number; name: string }>;
};

const AddItemModal: FC<AddItemModalProps> = ({
  onClose,
  visible,
  fields,
  type,
  customers = [],
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);

  const formatCurrency = (value: string): string => {
    const cleanedValue = value.replace(/\D/g, ""); // Elimina cualquier caracter que no sea número
    return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Añade los puntos de miles
  };

  const getCurrentDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Mes con dos dígitos
    const day = String(today.getDate()).padStart(2, "0"); // Día con dos dígitos
    return `${year}-${month}-${day}`;
  };

  const handleAddPress = () => {
    const params = fields.map((field) => field.value);

    if (type === "credits") {
      // Verificar si se ha seleccionado un cliente
      if (!selectedCustomer) {
        alert("Selecciona un cliente.");
        return;
      }

      // Añadir el crédito y pasar el ID del cliente seleccionado
      addCredit(
        selectedCustomer, // cliente seleccionado
        params[0], // date
        parseFloat(params[1]), // price
        params[2], // description
        parseFloat(params[3]), // initialFee
        () => {
          console.log("Crédito añadido con éxito");
          onClose(true);
          fields.forEach((field) => field.setValue(""));
        }
      );
    } else {
      addCustomer(
        params[0], // name
        params[1], // phoneNumber
        params[2], // address
        () => {
          console.log("Cliente añadido con éxito");
          onClose(true);
          fields.forEach((field) => field.setValue(""));
        }
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
          <View style={styles.closeContainer}>
            <Button
              icon={<Icon name="close" size={28} color={"#8A4C0B"} />}
              onPress={() => onClose()}
              type="clear"
            />
          </View>

          {type === "credits" && (
            <Picker
              selectedValue={selectedCustomer}
              onValueChange={(value) => setSelectedCustomer(value)}
            >
              <Picker.Item label="Selecciona un cliente" value={null} />
              {customers.map((customer) => (
                <Picker.Item
                  key={customer.id}
                  label={customer.name}
                  value={customer.id}
                />
              ))}
            </Picker>
          )}

          {fields.map((field, index) => (
            <View style={styles.formItem} key={index}>
              <View style={styles.inputContainer}>
                <Input
                  value={
                    field.label === "Valor" || field.label === "C/Inicial"
                      ? formatCurrency(field.value)
                      : field.label === "Fecha" && !field.value
                      ? getCurrentDate() // Asigna la fecha actual si está vacía
                      : field.value
                  }
                  onChangeText={(text) =>
                    field.setValue(
                      field.label === "Valor" || field.label === "C/Inicial"
                        ? formatCurrency(text)
                        : text
                    )
                  }
                  keyboardType={
                    field.label === "Valor" ||
                    field.label === "C/Inicial" ||
                    field.label === "Telefono"
                      ? "numeric"
                      : "default"
                  }
                />
              </View>
              <View style={styles.legendContainer}>
                <Text style={styles.legend}>{field.label}</Text>
              </View>
            </View>
          ))}
          <View style={styles.buttonContainer}>
            <Button
              title={"Añadir"}
              icon={<Icon name="add" color="#fff" />}
              color={"#8A4C0B"}
              onPress={handleAddPress}
              radius={"lg"}
              disabled={
                fields.some((field) => field.value.trim() === "") ||
                (type === "credits" && !selectedCustomer)
              }
            />
          </View>
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
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    elevation: 5,
  },
  closeContainer: {
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
  legend: {
    fontWeight: "500",
    color: "#8A4C0B",
  },
  buttonContainer: {
    alignItems: "flex-end",
  },
});

export default AddItemModal;

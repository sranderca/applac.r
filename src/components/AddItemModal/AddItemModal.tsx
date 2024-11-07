import { Button, Icon, Input } from "@rneui/themed";
import React, { FC, useEffect, useState } from "react";
import { Modal, View, StyleSheet, Text } from "react-native";
import { addCustomer, addCredit } from "../../hooks/database";

type AddItemModalProps = {
  onClose: (shouldUpdate?: boolean) => void;
  visible: boolean;
  fields: Array<{
    label: string;
    value: string;
    setValue: (text: string) => void;
  }>;
  type: string;
};

const AddItemModal: FC<AddItemModalProps> = ({
  onClose,
  visible,
  fields,
  type,
}) => {
  const handleAddPress = () => {
    const params = fields.map((field) => field.value);

    switch (type) {
      case "credits":
        addCredit(
          params[0], // customer
          params[1], // date
          parseFloat(params[2]), // price
          params[3], // description
          parseFloat(params[4]), // initialFee
          () => {
            console.log("Crédito añadido con éxito");
            onClose(true);
          }
        );
        break;

      case "customers":
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
        break;
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
          {fields.map((field, index) => (
            <View style={styles.formItem} key={index}>
              <View style={styles.inputContainer}>
                <Input value={field.value} onChangeText={field.setValue} />
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
              disabled={fields.some((field) => field.value.trim() === "")}
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

import { Button, Icon } from "@rneui/themed";
import React, { FC, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import AddItemModal from "../AddItemModal";

type AddItemProps = {
  text: string;
  fields: {
    label: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
  }[];
  type: string;
  customers?: any;
  onAddSucces: () => void;
};

const AddItem: FC<AddItemProps> = ({
  text,
  fields,
  type,
  customers,
  onAddSucces,
}) => {
  const [visible, setIsVisible] = useState<boolean>(false);

  const handleModalClose = (shouldUpdate?: boolean) => {
    if (shouldUpdate) {
      Alert.alert("Agregado exitosamente  ");
      onAddSucces();
    }
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Text style={styles.text}>{text}</Text>
      </View>
      <View style={styles.rightContainer}>
        <Button
          icon={<Icon name="add-circle-outline" color={"#fff"} />}
          radius={"lg"}
          color={"#8A4C0B"}
          onPress={() => setIsVisible(true)}
        />
      </View>
      <AddItemModal
        visible={visible}
        onClose={handleModalClose}
        fields={fields}
        type={type}
        customers={customers}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
  },
  leftContainer: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8A4C0B",
  },
  rightContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});

export default AddItem;

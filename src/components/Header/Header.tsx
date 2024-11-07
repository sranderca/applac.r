import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const urlImage =
  "https://firebasestorage.googleapis.com/v0/b/login-ecoaves.appspot.com/o/LOGO%20CIELO%20MARCA%20DE%20AGUA.png?alt=media&token=8bc9de60-fc7a-423f-8ed3-f71a8611c139";

const Header = () => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Text style={styles.texto}>
          ¿No te he dicho que si crees verás la gloria de Dios?
        </Text>
      </View>
      <View style={styles.rightContainer}>
        <Image source={{ uri: urlImage }} style={styles.profileImage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#f4ccbb",
    padding: 12,
  },
  leftContainer: {
    flex: 1,
    justifyContent: "center",
  },
  texto: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#8A4C0B",
  },
  rightContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  profileImage: {
    width: 70,
    height: 70,
  },
});

export default Header;

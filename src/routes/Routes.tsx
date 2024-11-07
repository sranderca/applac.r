import React, { useEffect } from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "../views/Home";
import Credits from "../views/Credits";
import Customers from "../views/Customers";
import Sales from "../views/Sales";
import Expenses from "../views/Expenses";
import Revenue from "../views/Revenue";
import Summary from "../views/Summary";
import { createTables } from "../hooks/database";

const Drawer = createDrawerNavigator();

const Routes = () => {
  useEffect(() => {
    createTables();
  }, []);
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          drawerStyle: {
            backgroundColor: "#f4ccbb",
            width: 220,
          },
          drawerLabelStyle: {
            color: "#8A4C0B",
          },
          drawerActiveBackgroundColor: "rgba(224, 185, 121, 0.4)",
        }}
      >
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Creditos" component={Credits} />
        <Drawer.Screen name="Clientes" component={Customers} />
        <Drawer.Screen name="Ventas" component={Sales} />
        <Drawer.Screen name="Egresos" component={Expenses} />
        <Drawer.Screen name="Ingresos" component={Revenue} />
        <Drawer.Screen name="Resumen" component={Summary} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default Routes;

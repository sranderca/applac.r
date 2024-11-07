import * as SQLite from "expo-sqlite/legacy";

const db = SQLite.openDatabase("lacr.db");

// Función para crear tablas
export const createTables = () => {
  db.transaction((tx) => {
    // Tabla de clientes
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phoneNumber TEXT,
        address TEXT
      );`
    );

    // Tabla de créditos con relación a clientes
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS credits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customerId INTEGER,  -- Esta es la referencia al id del cliente
        date TEXT,
        price REAL,
        description TEXT,
        initialFee REAL,
        FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE
      );`
    );
  });
};

// Función para añadir clientes
export const addCustomer = (name, phoneNumber, address, successCallback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO customers (name, phoneNumber, address) VALUES (?, ?, ?)",
      [name, phoneNumber, address],
      (txObj, resultSet) => successCallback(),
      (txObj, error) => console.error("Error al añadir cliente:", error)
    );
  });
};

// Función para añadir créditos
export const addCredit = (customerId, date, price, description, initialFee, successCallback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO credits (customerId, date, price, description, initialFee) VALUES (?, ?, ?, ?, ?)",
      [customerId, date, price, description, initialFee],
      (txObj, resultSet) => successCallback(),
      (txObj, error) => console.error("Error al añadir crédito:", error)
    );
  });
};

// Función para obtener clientes
export const getCustomers = (successCallback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM customers",
      null,
      (txObj, { rows: { _array } }) => successCallback(_array),
      (txObj, error) => console.error("Error al obtener clientes:", error)
    );
  });
};

export const deleteCustomer = (id, successCallback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM customers WHERE id = ?",
      [id],
      (txObj, resultSet) => successCallback(),
      (txObj, error) => console.error("Error al eliminar cliente:", error)
    );
  });
};

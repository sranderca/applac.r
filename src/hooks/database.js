import * as SQLite from "expo-sqlite/legacy";

const db = SQLite.openDatabase("newDatabseLacr.db");

export const getDBConnection = () => {
  return SQLite.openDatabase("newDatabseLacr.db");
};

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
        balance REAL,
        FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE
      );`
    );

    //Tabla de abonos
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        creditId INTEGER,
        date TEXT,
        amount REAL,
        note TEXT,
        FOREIGN KEY (creditId) REFERENCES credits(id)
      );`
    );

    //tabla de ventas
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT,
        date TEXT,
        price REAL
      );`
    );

    //tabal de gastos
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT,
        date TEXT,
        price REAL
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
export const addCredit = (
  customerId,
  date,
  price,
  description,
  initialFee,
  successCallback
) => {
  const balance = price - initialFee;

  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO credits (customerId, date, price, description, initialFee, balance) VALUES (?, ?, ?, ?, ?,  ?)",
      [customerId, date, price, description, initialFee, balance],
      (txObj, resultSet) => successCallback(),
      (txObj, error) => console.error("Error al añadir crédito:", error)
    );
  });
};

//funcion para añadir abonos
export const addPayment = (creditId, date, amount, note, successCallback) => {
  db.transaction((tx) => {
    // Insertar el nuevo abono
    tx.executeSql(
      `INSERT INTO payments (creditId, date, amount, note) VALUES (?, ?, ?, ?)`,
      [creditId, date, amount, note],
      (txObj, resultSet) => {
        // Actualizar el saldo del crédito
        tx.executeSql(
          `UPDATE credits SET balance = balance - ? WHERE id = ?`,
          [amount, creditId],
          () => successCallback(),
          (txObj, error) =>
            console.error("Error al actualizar el saldo del crédito:", error)
        );
      },
      (txObj, error) => console.error("Error al añadir abono:", error)
    );
  });
};

//funcion para añadir ventas
export const addSales = (description, date, price, successCallback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO sales (description, date, price) VALUES (?,?,?)",
      [description, date, price],
      (txObj, resultSet) => successCallback(),
      (txObj, error) => console.error("Error al añadir la venta:", error)
    );
  });
};

//funcion para añadir egresos
export const addExpenses = (description, date, price, successCallback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO expenses (description, date, price) VALUES (?,?,?)",
      [description, date, price],
      (txObj, resultSet) => successCallback(),
      (txObj, error) => console.error("Error al añadir el gasto:", error)
    );
  });
};

//función para obtener clientes
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

//funcion para obtener los creditos
export const getCredits = (successCallback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT credits.*, customers.name AS customerName 
       FROM credits 
       JOIN customers ON credits.customerId = customers.id`,
      [], // No necesitas parámetros en este caso
      (txObj, { rows: { _array } }) => successCallback(_array), // Devuelve los datos al callback
      (txObj, error) => {
        console.error("Error al obtener créditos:", error);
        successCallback([]); // Devuelve una lista vacía en caso de error
      }
    );
  });
};

//funcion para obtener los abonos
export const getPaymentsByCreditId = (creditId, setPayments) => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM payments WHERE creditId = ? ORDER BY date DESC`,
      [creditId],
      (txObj, { rows }) => {
        const payments = [];
        for (let i = 0; i < rows.length; i++) {
          payments.push(rows.item(i));
        }
        setPayments(payments);
      },
      (txObj, error) => {
        console.error("Error al obtener los abonos:", error);
      }
    );
  });
};

//función para obtener las ventas
export const getSales = (successCallback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM sales",
      null,
      (txObj, { rows: { _array } }) => successCallback(_array),
      (txObj, error) => console.error("Error al obtener las ventas:", error)
    );
  });
};

//función para obtener gastos
export const getExpenses = (successCallback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM expenses",
      null,
      (txObj, { rows: { _array } }) => successCallback(_array),
      (txObj, error) => console.error("Error al obtener los gastos:", error)
    );
  });
};

//funcion para actulizar el saldo de los creditos
export const updateCreditBalance = (creditId, newBalance, successCallback) => {
  const db = getDBConnection();
  db.transaction((tx) => {
    tx.executeSql(
      `UPDATE credits SET balance = ? WHERE id = ?`,
      [newBalance, creditId],
      () => successCallback(),
      (txObj, error) => {
        console.error("Error actualizando el saldo del crédito:", error);
      }
    );
  });
};

//funcion para eliminar un cliente
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

//funcion para eliminar un credito
export const deleteCredit = (creditId, successCallback) => {
  db.transaction((tx) => {
    // Primero eliminamos los abonos asociados a este crédito
    tx.executeSql(
      "DELETE FROM payments WHERE creditId = ?;",
      [creditId],
      () => {
        console.log(`Abonos asociados al crédito ${creditId} eliminados.`);
        // Luego eliminamos el crédito
        tx.executeSql(
          "DELETE FROM credits WHERE id = ?;",
          [creditId],
          (_, result) => {
            console.log(`Crédito con ID ${creditId} eliminado.`);
            successCallback(); // Ejecutamos el callback después de eliminar el crédito
          },
          (_, error) => {
            console.error("Error al eliminar el crédito:", error);
            return false; // Manejo del error
          }
        );
      },
      (_, error) => {
        console.error("Error al eliminar los abonos asociados:", error);
        return false; // Manejo del error
      }
    );
  });
};

//funcion para eliminar una venta
export const deleteSales = (id, successCallback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM sales WHERE id = ?",
      [id],
      (txObj, resultSet) => successCallback(),
      (txObj, error) => console.error("Error al eliminar el cliente:", error)
    );
  });
};

//funcion para eliminar un gasto
export const deleteExpenses = (id, successCallback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM expenses WHERE id = ?",
      [id],
      (txObj, resultSet) => successCallback(),
      (txObj, error) => console.error("Error al eliminar el gasto:", error)
    );
  });
};

db.transaction((tx) => {
  tx.executeSql(
    "PRAGMA table_info(credits);",
    [],
    (txObj, { rows }) => console.log("Credits table schema:", rows._array),
    (txObj, error) => console.error("Error retrieving table schema:", error)
  );
});

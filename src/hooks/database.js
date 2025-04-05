import * as SQLite from "expo-sqlite/legacy";

const db = SQLite.openDatabase("newDatabaseLacr.db");

export const getDBConnection = () => {
  return SQLite.openDatabase("newDatabaseLacr.db");
};

//función para crear tablas
export const createTables = () => {
  db.transaction((tx) => {
    //tabla de clientes
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phoneNumber TEXT,
        address TEXT
      );`
    );

    //tabla de créditos con relación a clientes
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS credits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customerId INTEGER,  -- Esta es la referencia al id del cliente
        date TEXT,
        price REAL,
        description TEXT,
        initialFee REAL,
        balance REAL,
        status TEXT DEFAULT 'activo',
        FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE
      );`
    );

    //tabla de abonos
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

    //tabal de ingresos
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS revenues (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT,
        date TEXT,
        price REAL
      );`
    );

    //tabla de creditos añadidos
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS credit_additions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        credit_id INTEGER,
        description TEXT,
        date TEXT,
        amount REAL,
        FOREIGN KEY (credit_id) REFERENCES credits (id)
    );`
    );
  });
};

//función para añadir clientes
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

//función para añadir créditos
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
      "INSERT INTO credits (customerId, date, price, description, initialFee, balance) VALUES (?, ?, ?, ?, ?, ?)",
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

//funcion para añadir ingresos
export const addRevenues = (description, date, price, successCallback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO revenues (description, date, price) VALUES (?,?,?)",
      [description, date, price],
      (txObj, resultSet) => successCallback(),
      (txObj, error) => console.error("Error al añadir el ingreso:", error)
    );
  });
};

//funcion para agregar nuevos creditos
export const addCreditAddition = (
  creditId,
  description,
  date,
  amount,
  successCallback
) => {
  db.transaction((tx) => {
    // Insertar el nuevo producto en credit_additions
    tx.executeSql(
      "INSERT INTO credit_additions (credit_id, description, date, amount) VALUES (?, ?, ?, ?)",
      [creditId, description, date, amount],
      (_, result) => {
        console.log("Producto agregado con éxito");

        // Ahora actualizar el saldo del crédito
        tx.executeSql(
          "UPDATE credits SET balance = balance + ? WHERE id = ?",
          [amount, creditId],
          (_, updateResult) => {
            console.log("Saldo actualizado con éxito");

            // Llamar el callback si existe
            if (successCallback) successCallback();
          },
          (_, updateError) => {
            console.error(
              "Error actualizando el saldo del crédito:",
              updateError
            );
          }
        );
      },
      (_, error) => {
        console.error("Error al agregar producto al crédito:", error);
      }
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

//función para obtener ingresos
export const getRevenues = (successCallback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM revenues",
      null,
      (txObj, { rows: { _array } }) => successCallback(_array),
      (txObj, error) => console.error("Error al obtener los ingresos:", error)
    );
  });
};

//funcion para obtener los nuevos creditos añadidos
export const getCreditAdditions = (creditId, setAdditions) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM credit_additions WHERE credit_id = ?",
      [creditId],
      (_, { rows }) => {
        setAdditions(rows._array);
      },
      (_, error) =>
        console.error("Error al obtener productos del crédito:", error)
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

//funcion para actualizar el estado de los creditos
export const updateCreditStatus = (creditId, status) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE credits SET status = ? WHERE id = ?",
      [status, creditId],
      (_, result) => {
        console.log(`crédito ${creditId} actualizado a ${status}`);
        console.log("Filas afectadas:", result.rowsAffected);
      },
      (_, error) =>
        console.error("Error al actualizar estado del crédito:", error)
    );
  });
};

//funcion para actualizar un credito
export const updateCredit = (
  id,
  newBalance,
  newDescription,
  successCallback
) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE credits SET balance = ?, description = ? WHERE id = ?",
      [newBalance, newDescription, id],
      () => {
        console.log("Crédito actualizado correctamente");
        successCallback();
      },
      (_, error) => {
        console.error("Error actualizando crédito: ", error);
        return false;
      }
    );
  });
};

//funcion para traer los datos clave del resumen mensual
export const getMonthlySummary = (month, year, callback) => {
  const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
  const endDate = `${year}-${month.toString().padStart(2, "0")}-31`;

  db.transaction((tx) => {
    tx.executeSql(
      `
      SELECT 
        -- Ingresos totales: cuota inicial + abonos + ventas + ingresos
        (
          (SELECT IFNULL(SUM(initialFee), 0) FROM credits WHERE date BETWEEN ? AND ?) +
          (SELECT IFNULL(SUM(amount), 0) FROM payments WHERE date BETWEEN ? AND ?) +
          (SELECT IFNULL(SUM(price), 0) FROM sales WHERE date BETWEEN ? AND ?) +
          (SELECT IFNULL(SUM(price), 0) FROM revenues WHERE date BETWEEN ? AND ?)
        ) AS totalIncome,

        -- Egresos totales
        (SELECT IFNULL(SUM(price), 0) FROM expenses WHERE date BETWEEN ? AND ?) AS totalExpenses,

        -- Créditos activos
        (SELECT COUNT(*) FROM credits WHERE status = 'activo') AS activeCredits,

        -- Saldo pendiente por cobrar
        (SELECT IFNULL(SUM(balance), 0) FROM credits WHERE status = 'activo') AS pendingBalance
      `,
      [
        startDate,
        endDate, // Cuota inicial
        startDate,
        endDate, // Abonos
        startDate,
        endDate, // Ventas
        startDate,
        endDate, // Ingresos
        startDate,
        endDate, // Egresos
      ],
      (_, { rows }) => callback(rows._array[0]),
      (_, error) => console.error("Error al obtener resumen mensual:", error)
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

//funcion para eliminar un ingreso
export const deleteRevenues = (id, successCallback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM revenues WHERE id = ?",
      [id],
      (txObj, resultSet) => successCallback(),
      (txObj, error) => console.error("Error al eliminar el ingreso:", error)
    );
  });
};

//funcion para obtener los movimientos
export const getFilteredMovements = (filter, callback) => {
  let startDate = "";
  let endDate = new Date();
  endDate.setHours(0, 0, 0, 0); // Elimina la hora para comparar solo la fecha
  endDate = endDate.toISOString().split("T")[0];

  if (filter === "today") {
    startDate = endDate;
  } else if (filter === "yesterday") {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    startDate = yesterday.toISOString().split("T")[0];
    endDate = startDate;
  } else if (filter === "last3days") {
    let threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    startDate = threeDaysAgo.toISOString().split("T")[0];
  } else if (filter === "last7days") {
    let sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    startDate = sevenDaysAgo.toISOString().split("T")[0];
  } else if (filter === "last30days") {
    let thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    startDate = thirtyDaysAgo.toISOString().split("T")[0];
  }

  db.transaction((tx) => {
    tx.executeSql(
      `SELECT 'Crédito' AS type, DATE(date) AS date, description, price AS amount FROM credits WHERE DATE(date) BETWEEN ? AND ? 
        UNION ALL 
      SELECT 'Abono' AS type, DATE(date) AS date, note AS description, amount FROM payments WHERE DATE(date) BETWEEN ? AND ? 
        UNION ALL 
      SELECT 'Venta' AS type, DATE(date) AS date, description, price AS amount FROM sales WHERE DATE(date) BETWEEN ? AND ? 
        UNION ALL 
      SELECT 'Egreso' AS type, DATE(date) AS date, description, price AS amount FROM expenses WHERE DATE(date) BETWEEN ? AND ?
        UNION ALL
      SELECT 'Ingreso' AS type, DATE(date) AS date, description, price AS amount FROM revenues WHERE DATE(date) BETWEEN ? AND ? 
        ORDER BY date DESC;
`,
      [
        startDate,
        endDate,
        startDate,
        endDate,
        startDate,
        endDate,
        startDate,
        endDate,
        startDate,
        endDate,
      ],
      (_, { rows }) => {
        console.log("Movimientos obtenidos:", rows._array);
        callback(rows._array);
      },
      (_, error) => console.error("Error al obtener movimientos:", error)
    );
  });
};

db.transaction((tx) => {
  tx.executeSql(
    "PRAGMA table_info(credits);",
    [],
    (_, { rows }) =>
      console.log("Estructura de la tabla credits:", rows._array),
    (_, error) =>
      console.error("Error al obtener estructura de credits:", error)
  );
});

const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "react",
});

// Read: Get all stock market data
app.get("/api/stock-market-data", (req, res) => {
  const query = "SELECT * FROM stock_market_data";
  dbConnection.query(query, (error, results) => {
    if (error) return res.status(500).json({ error: error.message });
    const totalRows = results.length;
    return res.json({ data: results, total_rows: totalRows });
  });
});

// Create: Add a new stock market data entry
app.post("/api/stock-market-data", (req, res) => {
  const { date, trade_code, high, low, open, close, volume } = req.body;
  if (!date || !trade_code) {
    return res
      .status(400)
      .json({ error: "Date and Trade Code cannot be null" });
  }
  const id = Date.now(); // Use current epoch time as ID
  const query =
    "INSERT INTO stock_market_data (id, date, trade_code, high, low, open, close, volume) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  dbConnection.query(
    query,
    [id, date, trade_code, high, low, open, close, volume],
    (error, results) => {
      if (error) return res.status(500).json({ error: error.message });
      return res
        .status(201)
        .json({ message: "Data inserted successfully", id: results.insertId });
    }
  );
});

// Update: Update an existing stock market data entry
app.put("/api/stock-market-data/:id", (req, res) => {
  const { id } = req.params;
  const { date, trade_code, high, low, open, close, volume } = req.body;
  if (!date || !trade_code) {
    return res
      .status(400)
      .json({ error: "Date and Trade Code cannot be null" });
  }
  const query =
    "UPDATE stock_market_data SET date = ?, trade_code = ?, high = ?, low = ?, open = ?, close = ?, volume = ? WHERE id = ?";
  dbConnection.query(
    query,
    [date, trade_code, high, low, open, close, volume, id],
    (error, results) => {
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ message: "Data updated successfully" });
    }
  );
});

// Delete: Delete a stock market data entry
app.delete("/api/stock-market-data/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM stock_market_data WHERE id = ?";
  dbConnection.query(query, [id], (error, results) => {
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ message: "Data deleted successfully" });
  });
});

app.listen(8081, () => {
  console.log("Server is listening on port 8081");
});

// const express = require("express");
// const mysql = require("mysql");
// const cors = require("cors");
// const bodyParser = require("body-parser");

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// const dbConnection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "react"
// });

// // Read: Get all stock market data
// app.get("/api/stock-market-data", (req, res) => {
//   const query = "SELECT * FROM stock_market_data";

//   dbConnection.query(query, (error, results) => {
//     if (error) {
//       return res.status(500).json({ error: error.message });
//     }

//     const totalRows = results.length;
//     return res.json({
//       data: results,
//       total_rows: totalRows
//     });
//   });
// });

// // Create: Add a new stock market data entry
// app.post("/api/stock-market-data", (req, res) => {
//   const { date, trade_code, high, low, open, close, volume } = req.body;
//   const query = "INSERT INTO stock_market_data (date, trade_code, high, low, open, close, volume) VALUES (?, ?, ?, ?, ?, ?, ?)";

//   dbConnection.query(query, [date, trade_code, high, low, open, close, volume], (error, results) => {
//     if (error) {
//       return res.status(500).json({ error: error.message });
//     }

//     return res.status(201).json({ message: "Data inserted successfully", id: results.insertId });
//   });
// });

// // Update: Update an existing stock market data entry
// app.put("/api/stock-market-data/:id", (req, res) => {
//   const { id } = req.params;
//   const { date, trade_code, high, low, open, close, volume } = req.body;
//   const query = "UPDATE stock_market_data SET date = ?, trade_code = ?, high = ?, low = ?, open = ?, close = ?, volume = ? WHERE id = ?";

//   dbConnection.query(query, [date, trade_code, high, low, open, close, volume, id], (error, results) => {
//     if (error) {
//       return res.status(500).json({ error: error.message });
//     }

//     return res.json({ message: "Data updated successfully" });
//   });
// });

// // Delete: Delete a stock market data entry
// app.delete("/api/stock-market-data/:id", (req, res) => {
//   const { id } = req.params;
//   const query = "DELETE FROM stock_market_data WHERE id = ?";

//   dbConnection.query(query, [id], (error, results) => {
//     if (error) {
//       return res.status(500).json({ error: error.message });
//     }

//     return res.json({ message: "Data deleted successfully" });
//   });
// });

// app.listen(8081, () => {
//   console.log("Server is listening on port 8081");
// });

// const express = require("express");
// const mysql = require("mysql");
// const cors = require("cors");

// const app = express();
// app.use(cors());

// const dbConnection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "react"
// });

// app.get("/api/stock-market-data", (req, response) => {
//     const query = "SELECT * FROM stock_market_data";

//     dbConnection.query(query, (error, results) => {
//         if (error) {
//             return response.status(500).json({ error: error.message });
//         }

//         const totalRows = results.length;
//         return response.json({
//             data: results,
//             total_rows: totalRows
//         });
//     });
// });

// app.listen(8081, () => {
//     console.log("Server is listening on port 8081");
// });

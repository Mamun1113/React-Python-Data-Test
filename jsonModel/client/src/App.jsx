import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [stockMarketData, setStockMarketData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);

  const fetchStockMarketData = async () => {
    const response = await axios.get(
      "http://127.0.0.1:8080/api/stock-market-data"
    );
    console.log(response.data);
    setStockMarketData(response.data.data);
    setTotalRows(response.data.total_rows);
  };

  useEffect(() => {
    fetchStockMarketData();
  }, []);

  return (
    <>
      <div className="header">Stock Market Data</div>
      <div className="container">
        <p>Total rows: {totalRows}</p>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>DATE</th>
                <th>TRADE CODE</th>
                <th>HIGH</th>
                <th>LOW</th>
                <th>OPEN</th>
                <th>CLOSE</th>
                <th>VOLUME</th>
              </tr>
            </thead>
            <tbody>
              {stockMarketData.map((data, index) => (
                <tr key={index}>
                  <td>{data.date}</td>
                  <td>{data.trade_code}</td>
                  <td>{data.high}</td>
                  <td>{data.low}</td>
                  <td>{data.open}</td>
                  <td>{data.close}</td>
                  <td>{data.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;

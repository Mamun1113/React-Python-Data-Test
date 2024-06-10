import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./App.css";

// Register the required components from Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [stockMarketData, setStockMarketData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [form, setForm] = useState({
    date: new Date(),
    trade_code: "",
    high: "",
    low: "",
    open: "",
    close: "",
    volume: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTradeCode, setSelectedTradeCode] = useState("");

  const fetchStockMarketData = async () => {
    console.log(Date.now());

    const response = await axios.get(
      "http://localhost:8081/api/stock-market-data"
    );
    setStockMarketData(response.data.data);
    setTotalRows(response.data.total_rows);
  };

  useEffect(() => {
    fetchStockMarketData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setForm({ ...form, date: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.date || !form.trade_code) {
      alert("Date and Trade Code cannot be null");
      return;
    }

    // Validate trade_code is alphanumeric
    const alphanumericRegex = /^[a-z0-9]+$/i;
    if (!alphanumericRegex.test(form.trade_code)) {
      alert("Trade code must consist of alphanumeric characters only.");
      return;
    }

    const formData = { ...form, date: form.date.toISOString().split("T")[0] }; // Convert date to string
    if (isEditing) {
      await axios.put(
        `http://localhost:8081/api/stock-market-data/${currentId}`,
        formData
      );
      setIsEditing(false);
      setCurrentId(null);
    } else {
      await axios.post("http://localhost:8081/api/stock-market-data", formData);
    }
    setForm({
      date: new Date(),
      trade_code: "",
      high: "",
      low: "",
      open: "",
      close: "",
      volume: "",
    });
    fetchStockMarketData();
  };

  const handleEdit = (data) => {
    setIsEditing(true);
    setCurrentId(data.id);
    setForm({ ...data, date: new Date(data.date) });
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8081/api/stock-market-data/${id}`);
    fetchStockMarketData();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTradeCodeChange = (e) => {
    setSelectedTradeCode(e.target.value);
  };

  const filteredData = stockMarketData.filter((data) =>
    data.trade_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = stockMarketData
    .filter((data) =>
      selectedTradeCode ? data.trade_code === selectedTradeCode : true
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const lineChartData = {
    labels: chartData.map((data) => data.date),
    datasets: [
      {
        label: "Close Price",
        data: chartData.map((data) => data.close),
        type: "line",
        borderColor: "#8d8d72",
        yAxisID: "y1",
      },
      {
        label: "Volume",
        data: chartData.map((data) => data.volume),
        type: "bar",
        backgroundColor: "#4eabb1",
        yAxisID: "y2",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          font: {
            family: "Itim",
            size: 16,
            weight: "bold",
          },
        },
        ticks: {
          font: {
            family: "Itim",
            size: 12,
          },
        },
      },
      y1: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Close",
          font: {
            family: "Itim",
            size: 16,
            weight: "bold",
          },
        },
        ticks: {
          font: {
            family: "Itim",
            size: 12,
          },
        },
      },
      y2: {
        position: "right",
        title: {
          display: true,
          text: "Volume",
          font: {
            family: "Itim",
            size: 16,
            weight: "bold",
          },
        },
        ticks: {
          font: {
            family: "Itim",
            size: 12,
          },
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            family: "Arial",
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="container">
      <div className="header">Stock Market Data</div>
      <div className="form-container">
        <form onSubmit={handleSubmit} className="form">
          <p>Add/Update</p>
          <div className="form-row">
            <DatePicker
              selected={form.date}
              onChange={handleDateChange}
              className="datepicker"
              dateFormat="yyyy-MM-dd"
              required
            />
            <input
              name="trade_code"
              placeholder="Trade Code"
              value={form.trade_code}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="high"
              placeholder="High"
              value={form.high}
              onChange={handleChange}
            />
            <input
              type="number"
              name="low"
              placeholder="Low"
              value={form.low}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <input
              type="number"
              name="open"
              placeholder="Open"
              value={form.open}
              onChange={handleChange}
            />
            <input
              type="number"
              name="close"
              placeholder="Close"
              value={form.close}
              onChange={handleChange}
            />
            <input
              type="number"
              name="volume"
              placeholder="Volume"
              value={form.volume}
              onChange={handleChange}
            />
            <button className="button-addupdate" type="submit">
              {isEditing ? "Update" : "Add"} Data
            </button>
          </div>
        </form>
        <br></br>
        <div className="search-bar">
          <p>Search</p>
          <input
            type="text"
            placeholder="Search by Trade Code"
            value={searchTerm}
            onChange={handleSearch}
            className="searchbar"
          />
        </div>
      </div>

      <div className="chart-container">
        <select onChange={handleTradeCodeChange} className="dropdown">
          <option value="">All</option>
          {Array.from(
            new Set(stockMarketData.map((data) => data.trade_code))
          ).map((code, index) => (
            <option key={index} value={code}>
              {code}
            </option>
          ))}
        </select>
        <Line data={lineChartData} options={options} />
      </div>
      <div className="table-container">
        <p>TABLE : Total rows {totalRows}</p>
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
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((data, index) => (
              <tr key={index}>
                <td>{data.date}</td>
                <td>{data.trade_code}</td>
                <td>{data.high}</td>
                <td>{data.low}</td>
                <td>{data.open}</td>
                <td>{data.close}</td>
                <td>{data.volume}</td>
                <td>
                  <button
                    className="button-edit"
                    onClick={() => handleEdit(data)}
                  >
                    Edit
                  </button>
                  <button
                    className="button-delete"
                    onClick={() => handleDelete(data.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;

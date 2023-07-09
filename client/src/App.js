import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chartjs-plugin-streaming";
import "./styles.css";
import moment from "moment";
import "./App.css";
import io from "socket.io-client";
import AppNavbar from "./AppNavbar";
import {
  calculateAverage,
  calculateMaxium,
  calculateMinimum,
} from "./MathUtils";

const chartColors = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)",
};

const color = Chart.helpers.color;
const data = {
  datasets: [
    {
      label: "Dataset 1 (linear interpolation)",
      backgroundColor: color(chartColors.red).alpha(0.5).rgbString(),
      borderColor: chartColors.red,
      fill: false,
      lineTension: 0,
      borderDash: [8, 4],
      data: [],
    },
  ],
};

function App() {
  const [socket, setSocket] = useState(null);
  const [heartRate, setHeartRate] = useState(null);
  const [lastPulse, setLastPulse] = useState(null);
  const [readingState, setReadingState] = useState("idle");
  const [person, setPerson] = useState("");
  const [ticksLimit, setTicksLimit] = useState(30);
  const [heartRatesHistory, setHeartRatesHistory] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.on("heartRate", (data2) => {
        let value = filteredValue(data2);
        setHeartRate(value);
        console.log(value);

        heartRatesHistory.push(value);
        setHeartRatesHistory(heartRatesHistory);
        console.log("history: " + heartRatesHistory);

        // Espera 1 seg, para que los graficos no sean rectos y sean diagonales??
        setTimeout(() => {
          setLastPulse(value);
        }, "1000");
        if (ticksLimit <= heartRatesHistory.length) {
          stopReading();
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [socket]);

  const stopReading = () => {
    setReadingState("finished");
    saveResultsToHistory();
    disconnectWebSocket();
  };

  const filteredValue = (data) => {
    let value = data - 250;
    const maxValue = 180;
    const minValue = 0;
    return value > maxValue || value < minValue ? 0 : value;
  };

  const heartRateValue = () => {
    // BORRAR TODO MENOS LA ULTIMA LINEA
    // ES SOLO PARA PROBAR
    if (ticksLimit <= heartRatesHistory.length) {
      stopReading();
    }
    const min = 80;
    const max = 120;
    let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    heartRatesHistory.push(randomNumber);
    setHeartRatesHistory(heartRatesHistory);
    setHeartRate(randomNumber);

    // DEJAR ESTO DE ABAJO!!!!
    return heartRate;
  };

  const options = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      xAxes: [
        {
          type: "realtime",
          distribution: "linear",
          realtime: {
            onRefresh: function (chart) {
              if (socket) {
                chart.data.datasets[0].data.push({
                  x: moment(),
                  y: heartRateValue(),
                });
              }
            },
            delay: 500,
            refresh: 500,
            time: {
              displayFormat: "h:mm",
            },
            pause: !socket,
          },
          ticks: {
            displayFormats: 1,
            maxRotation: 0,
            minRotation: 0,
            stepSize: 1,
            maxTicksLimit: ticksLimit,
            minUnit: "second",
            source: "auto",
            autoSkip: true,
            callback: function (value) {
              return moment(value, "HH:mm:ss").format("H:mm:ss");
            },
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            stepSize: 5,
            beginAtZero: false,
            min: 40,
            max: 180,
          },
        },
      ],
    },
    legend: {
      display: false, // Oculta la leyenda
    },
  };

  const startReading = () => {
    setHeartRate([]);
    setReadingState("running");
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);
  };

  const disconnectWebSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const restartProgram = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setReadingState("idle");
    disconnectWebSocket();
    setHeartRatesHistory([]);
    setHeartRate(null);
    setLastPulse(null);
    setPerson("");
  };

  const renderButton = () => {
    if (socket && readingState === "running") {
      return (
        <button
          disabled={readingState === "running"}
          className="btn btn-secondary"
          onClick={disconnectWebSocket}
        >
          ({ticksLimit - heartRatesHistory.length}) Leyendo ...
        </button>
      );
    } else if (readingState === "finished") {
      return (
        <button className="btn btn-dark shadow" onClick={restartProgram}>
          Reiniciar
        </button>
      );
    } else {
      return (
        <div className="d-flex">
          <input
            type="text"
            className="form-control m-1 w-50"
            placeholder="Inserte nombre"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
          />
          <input
            type="number"
            className="form-control m-1 w-25"
            placeholder="Ticks"
            value={ticksLimit}
            onChange={(e) => setTicksLimit(e.target.value)}
          />
          <button
            className="btn btn-primary shadow m-1"
            disabled={!person || !ticksLimit || ticksLimit <= 0}
            onClick={startReading}
          >
            Leer
          </button>
        </div>
      );
    }
  };

  const saveResultsToHistory = () => {
    let history = JSON.parse(localStorage.getItem("history"));
    if (!history) {
      history = [];
    }
    const newResult = {
      person: person,
      minimum: calculateMinimum(heartRatesHistory),
      maximum: calculateMaxium(heartRatesHistory),
      average: calculateAverage(heartRatesHistory),
      timestamp: new Date().toLocaleString(),
    };

    history.unshift(newResult);
    localStorage.setItem("history", JSON.stringify(history));
  };

  return (
    <>
      <AppNavbar/>
      <div className="container App mt-4 w-75">
        <div className="row g-3 d-flex">
          <div className="card p-3 col-12">
            <div className="heartRateGraphic">
              <Line data={data} options={options} />
            </div>
          </div>
          <div className="mt-3 small">
            <table className="table table-bordered small m-0 p-0">
              <thead>
                <tr>
                  <th scope="col">Minimo</th>
                  <th scope="col">Maximo</th>
                  <th scope="col">Promedio</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{calculateMinimum(heartRatesHistory)}</td>
                  <td>{calculateMaxium(heartRatesHistory)}</td>
                  <td>{calculateAverage(heartRatesHistory)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="row g-3 mt-1">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="">{renderButton()}</div>
            <div className="d-flex align-items-center ">
              <div className="numero">
                <span>{lastPulse}</span>
              </div>
              <div className="corazon w-25 y-25">
                <span role="img" aria-label="Corazón latiendo">
                  💓
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

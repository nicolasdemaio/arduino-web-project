import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import "chartjs-plugin-streaming";
import "./styles.css";
import moment from "moment";
import "./App.css";
import io from "socket.io-client";

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
  const [randomNumber, setRandomNumber] = useState(null);
  const [pulso, setPulso] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.on("randomNumber", (data2) => {
        setRandomNumber(data2);
        console.log(data2);
        // Espera 1 seg, para que los graficos no sean rectos y sean diagonales??
        setTimeout(() => {
          setPulso(data2);
        }, "1000");
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [socket]);
  const generarNumeroAleatorio = () => {
    return randomNumber;
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
                  y: generarNumeroAleatorio(),
                });
              }
            },
            delay: 1000,
            refresh: 1000,
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
            maxTicksLimit: 30,
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
            beginAtZero: true,
            max: 200,
          },
        },
      ],
      
    },
    legend: {
      display: false, // Oculta la leyenda
    },
  };

  const connectWebSocket = () => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);
  };

  const disconnectWebSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  return (
    <>
      <nav class="navbar bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <span style={{color:'white'}}>ReactCardio</span>
        </a>
      </div>
      </nav>
    <div className="container App mt-4">
      <h1 className="fw-bold">Sensor de ritmo cardiaco</h1>
      <div className="row">
        <div className="card p-3 col-12">
          <div className="heartRateGraphic">
            <Line data={data} options={options} />
          </div>
        </div>
        <div class="d-flex justify-content-between mt-3 align-items-center">
          <div>
            {socket ? (
    
              <button
                className="btn btn-light shadow"
                onClick={disconnectWebSocket}
              >
                Detener lectura
              </button>
              
  
            ) : (
              <button
                className="btn btn-primary shadow"
                onClick={connectWebSocket}
              >
                Comenzar lectura
              </button>
            )}
          </div>
          <div className="d-flex align-items-center">
          <div className="numero">
              <span>{pulso}</span>
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

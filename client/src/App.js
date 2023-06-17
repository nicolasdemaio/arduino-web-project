import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import "chartjs-plugin-streaming";
import "./styles.css";
import moment from "moment";
import './App.css';
import io from 'socket.io-client';

const chartColors = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)"
};

const color = Chart.helpers.color;
const data = {
  datasets: [
    {
      label: "Dataset 1 (linear interpolation)",
      backgroundColor: color(chartColors.red)
        .alpha(0.5)
        .rgbString(),
      borderColor: chartColors.red,
      fill: false,
      lineTension: 0,
      borderDash: [8, 4],
      data: []
    }
  ]
};

function App() {
    const [randomNumberA, setRandomNumberA] = useState(null);
    const socket = io('http://localhost:3001');
  
    useEffect(() => {
      socket.on('randomNumber', (data2) => {
        console.log(data.datasets[0].data)
        setRandomNumberA(data2);
      });
  
      return () => {
        socket.disconnect();
      };
    }, []);

const [numero, setNumero] = useState(0);
const spanRef = useRef(null);
const Chart = require("react-chartjs-2").Chart;
const generarNumeroAleatorio = () => {
  return randomNumberA;
};




const options = {
  elements: {
    line: {
      tension: 0.5
    }
  },
  scales: {
    xAxes: [
      {
        type: "realtime",
        distribution: "linear",
        realtime: {
          onRefresh: function(chart) {
            chart.data.datasets[0].data.push({
              x: moment(),
              y: generarNumeroAleatorio()
            });
            
          },
          delay: 0,
          refresh: 0,
          time: {
            displayFormat: "h:mm"
          }
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
          callback: function(value) {
            return moment(value, "HH:mm:ss").format("HH:mm:ss");
          }
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          max: 200
        }
      }
    ]
  }
};
  return (
    <div className="container App">
      <div className="heartRateGraphic" >
        <Line data={data} options={options} />
      </div>
      <div className="div2">
        <div className="corazon">
          <span role="img" aria-label="Corazón latiendo">💓</span>
        </div>
        <div className="numero">
          <span>{randomNumberA}</span>
        </div>
      </div>
    </div>
  );
}

export default App;

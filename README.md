# Proyecto: Sensor de ritmo cardiaco
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Arduino](https://img.shields.io/badge/Arduino_IDE-00979D?style=for-the-badge&logo=arduino&logoColor=white)
![VSCode](https://img.shields.io/badge/VSCode-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white)

## Índice

* [Introducción](#intro)

* [Instalación](#instalacion)

* [Desarrolladores](#desarrolladores)

## 📃 Introducción<a name="intro"></a>

El proyecto realizado es para la materia: Introducción a los microcontroladores.
Se optó por desarrollar un sensor de pulso cardiaco haciendo uso del microcontrolador que Arduino UNO posee.
Para poder observar la variación de pulso cardiaco en el tiempo se desarrollo y utilizo:
- Placa Arduino UNO con componentes electronicos necesarios para la medición.
- Un servidor (NodeJS) que, mediante la utilización de la libreria johnny-five, hace lectura mediante puerto Serial a la placa Arduino UNO.
- Un cliente Web (ReactJS) que hace lectura del dato traido por el servidor a través de un WebSocket para que la lectura sea en tiempo real.

## 📁 Instalación<a name="instalacion"></a>

Para poder ejecutar el proyecto localmente y observar la medición necesitamos los componentes electronicos.
Si lo que buscamos es poder observar el cliente web y servidor haremos:
1. Clonamos repositorio de Github
2. Nos paramos en la raíz del proyecto y ejecutamos en la terminal:
  ```
  cd server
  npm install
  cd ..
  cd client
  npm install
  ```
Con estos comandos instalamos las dependencias y ejecutamos localmente los dos modulos del repositorio.
Si nos dirijimos a ```localhost:3000``` veremos el gráfico y nuestro cliente se conectará al servidor mediante WebSocket por puerto 3001.

## 🛠️ Desarrolladores<a name="desarrolladores"></a>

- Gonzalo Baez
- Nicolás De Maio

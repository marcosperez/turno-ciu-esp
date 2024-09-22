const express = require("express");
const { VerificarSiHayTurnos, VerificarMision } = require("./utils");

const app = express();
const PORT = process.env.PORT || 9999;

app.get("/sacar-cita", async (req, res) => {
  res.json(await VerificarSiHayTurnos());
});

app.get("/verificar-mision-consular", async (req, res) => {
  res.json(await VerificarMision());
});

app.get("/", async (req, res) => {
  res.send("Hola, este es el servidor de sacar-cita.");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log(`URL para sacar cita:  http://localhost:${PORT}/sacar-cita`);
  console.log(
    `URL para sacar cita:  http://localhost:${PORT}/verificar-mision-consular`
  );
});

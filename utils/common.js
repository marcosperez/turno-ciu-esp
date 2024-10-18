import puppeteer from "puppeteer";
import { enviarCorreo } from "./email.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Aplay from "node-aplay"; // Importa la librería node-aplay
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function EsperarSegundos(segundos) {
  return new Promise((resolve) => {
    setTimeout(resolve, segundos * 1000);
  });
}
function InformameHayTurnosss() {
  console.log("Play music");

  enviarCorreo(
    "Hay turnooooooooo",
    "Hay turnoooooooooooo...",
    "aaah soy una tabla con turnooooo"
  );
  PlaySong(1);
}

export const PlaySong = (contador) => {
  if (contador > 60) {
    return;
  }

  const audioPath = join(__dirname, "musica-aleluya.wav");
  const player = new Aplay(audioPath);

  player.play();

  player.on("complete", () => {
    console.log("Audio finalizado");
    PlaySong(contador + 1);
  });

  player.on("error", (err) => {
    console.error("Error al reproducir el audio:", err);
  });
};

async function LaunchBrowser(options = { headless: true }) {
  return await puppeteer.launch(options);
}

/**
 * Obtiene la fecha y hora actual en formato YYYYMMDD_HHMMSS.
 * @returns {string} - La fecha y hora actual.
 */
function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}

/**
 * Crea una carpeta si no existe.
 * @param {string} dir - La ruta de la carpeta.
 */
function createDirectoryIfNotExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export {
  LaunchBrowser,
  InformameHayTurnosss,
  EsperarSegundos,
  getCurrentDateTime,
  createDirectoryIfNotExists,
};

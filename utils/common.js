import puppeteer from "puppeteer";
import Player from "play-sound";
import { enviarCorreo } from "./email.js";

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
  PlaySong();
}

export const PlaySong = () => {
  const player = new Player();
  player.play("./musica-aleluya.mp3", (err) => {
    if (err) {
      console.error("Error al reproducir el audio:", err);
    } else {
      console.log("Audio reproducido con éxito");

      InformameHayTurnosss();
    }
  });
};

async function LaunchBrowser() {
  return await puppeteer.launch({ headless: true });
}

export { LaunchBrowser, InformameHayTurnosss, EsperarSegundos };

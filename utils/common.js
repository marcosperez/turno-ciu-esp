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
  PlaySong(1);
}

export const PlaySong = (contador) => {
  if (contador > 6) {
    return;
  }
  const player = new Player();
  const audio = player.play("./musica-aleluya.mp3", (err) => {
    if (err) {
      console.error("Error al reproducir el audio:", err);
    } else {
      console.log("Audio reproducido con éxito");
    }
  });

  audio.on("complete", () => {
    console.log("Audio finalizado");
    PlaySong(contador + 1);
  });
};

async function LaunchBrowser(options = { headless: true }) {
  return await puppeteer.launch(options);
}

export { LaunchBrowser, InformameHayTurnosss, EsperarSegundos };

import chalk from "chalk";
import Table from "cli-table3";
import { VerificarMision } from "./functions/verificarMision.js";
import { VerificarSiHayTurnos } from "./functions/verificarTurnos.js";
import { enviarCorreo } from "./utils/email.js";
import { SendWhatsAppMessage } from "./utils/whatsapp.js";
import {
  createDirectoryIfNotExists,
  getCurrentDateTime,
} from "./utils/common.js";

const results = [];
let attemptCount = 6;

async function verify() {
  const currentDateTime = getCurrentDateTime();
  const verifyDirPath = `./screenshots/${currentDateTime}`;
  createDirectoryIfNotExists(verifyDirPath);
  const resultTurnos = await VerificarSiHayTurnos(verifyDirPath);
  const resultMision = await VerificarMision(verifyDirPath);

  const result = {
    timestamp: new Date(),
    turnos: resultTurnos.hayturnos,
    mision: resultMision.hayFechaDeMision,
  };

  results.push(result);

  // Keep only the results from the last 24 hours
  const oneDayAgo = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  while (results.length > 0 && results[0].timestamp < oneDayAgo) {
    results.shift();
  }

  // Create a new table
  const table = new Table({
    head: [chalk.blue("Timestamp"), chalk.blue("Turnos"), chalk.blue("Mision")],
    colWidths: [30, 10, 10],
  });

  // Add rows to the table
  results.forEach((result) => {
    table.push([
      result.timestamp.toLocaleString(),
      result.turnos ? chalk.green("SI") : chalk.red("NO"),
      result.mision ? chalk.green("SI") : chalk.red("NO"),
    ]);
  });

  // Print the table
  console.log(table.toString());

  attemptCount++;
  if (attemptCount >= 6) {
    // Convert table to HTML
    const htmlTable = `
      <table border="1" cellpadding="5" cellspacing="0">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Turnos</th>
            <th>Mision</th>
          </tr>
        </thead>
        <tbody>
          ${results
            .map(
              (result) => `
            <tr>
              <td>${result.timestamp.toLocaleString()}</td>
              <td>${result.turnos ? "SI" : "NO"}</td>
              <td>${result.mision ? "SI" : "NO"}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

    await enviarCorreo(
      "Resultado de tabla",
      "Tabla con ultimos resultados...",
      htmlTable
    );

    attemptCount = 0;
  }
  await SendWhatsAppMessage(results);
}

function main() {
  console.log("[MAIN] Task running at", new Date());

  const scheduleNextRun = () => {
    const now = new Date();
    const nextRun = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours() + 1,
      10,
      0,
      0
    );
    const delay = nextRun - now;

    console.log(`Next run at ${nextRun}, delay ${delay / 1000 / 60} min`);

    setTimeout(async () => {
      console.log("Task running at ", new Date());
      await verify();
      scheduleNextRun(); // Schedule the next run after the current one finishes
    }, delay);
  };

  scheduleNextRun();
}

main();

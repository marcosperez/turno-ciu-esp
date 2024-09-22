const puppeteer = require("puppeteer");
const player = require("play-sound")((opts = {}));

function esperarSegundos(segundos) {
  return new Promise((resolve) => {
    setTimeout(resolve, segundos * 1000);
  });
}
function playAleluya() {
  console.log("Play music");

  // player.play("./musica-aleluya.mp3", (err) => {
  //   if (err) {
  //     console.error("Error al reproducir el audio:", err);
  //   } else {
  //     console.log("Audio reproducido con éxito");

  //     playAleluya();
  //   }
  // });
}

async function launchBrowser() {
  // Local
  // browser = await puppeteer.launch({ headless: false });

  // Servidor docker
  return await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    executablePath: "/usr/bin/google-chrome",
    args: ["--no-sandbox"],
  });
}

async function VerificarMision() {
  console.log("Iniciando proceso para verificacion de mision...");
  let browser, page;

  browser = await launchBrowser();

  console.log("Navegador lanzado.");
  page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log("Nueva página creada.");

  try {
    await page.goto(
      "https://www.exteriores.gob.es/Consulados/rosario/es/Comunicacion/Noticias/Paginas/Articulos/Misiones-Consulares.aspx",
      {
        waitUntil: "networkidle2",
      }
    );
    console.log("Página de instrucciones cargada.");
    // Busca el texto
    await esperarSegundos(5);
    console.log("Esperando 5 segundos...");

    const existeTexto = await page.evaluate(() => {
      // Busca el elemento que contiene el texto específico
      const element = document.querySelector("span > strong + span");
      return element && element.textContent.includes("Fecha a confirmar2.");
    });

    if (existeTexto) {
      console.log("Captura de pantalla guardada como no-hay-fecha.mision.png");
      await page.screenshot({ path: "./no-hay-fecha.mision.png" });
      return { hayFechaDeMision: false };
    }

    console.log("Captura de pantalla guardada como hay-fecha-mision.png");
    await page.screenshot({ path: "./hay-fecha-mision.png" });
    playAleluya();
    return { hayFechaDeMision: true };
  } catch (error) {
    console.error("Error al lanzar el navegador: ", error);
    if (browser) await browser.close();
    return { hayturnos: false };
  }
}

async function VerificarSiHayTurnos() {
  console.log("Iniciando proceso para sacar cita...");
  let browser, page;
  browser = await puppeteer.launch({ headless: false });
  // browser = await puppeteer.launch({
  //   headless: true,
  //   // executablePath: "/usr/bin/google-chrome",
  //   args: ["--no-sandbox", "--disable-setuid-sandbox"],
  // });

  // browser = await puppeteer.launch({
  //   headless: true,
  //   args: ["--no-sandbox", "--disable-setuid-sandbox"],
  // });
  console.log("Navegador lanzado.");
  page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log("Nueva página creada.");

  try {
    await page.goto(
      "https://www.exteriores.gob.es/Consulados/rosario/es/Comunicacion/Noticias/Paginas/Articulos/Instrucciones-para-solicitar-cita-previa.aspx",
      {
        waitUntil: "networkidle2",
      }
    );
    console.log("Página de instrucciones cargada.");
  } catch (error) {
    console.error("Error al lanzar el navegador: ", error);
    if (browser) await browser.close();
    return { hayturnos: false };
  }

  try {
    await page.waitForSelector(
      'a[href="https://www.citaconsular.es/es/hosteds/widgetdefault/2bc271dfe25b4c2dc909d105a21abff93"]'
    );
    console.log("Selector del enlace de cita encontrado.");
    console.log("Esperando 5 segundos...");
    await esperarSegundos(5);
    await page.click(
      'a[href="https://www.citaconsular.es/es/hosteds/widgetdefault/2bc271dfe25b4c2dc909d105a21abff93"]'
    );
    console.log("Enlace de cita clickeado.");

    console.log("Esperando 5 segundos...");

    console.log("Dialog aceptado.");

    page.on("dialog", async (dialog) => {
      console.log("Diálogo detectado: " + dialog.message());
      await esperarSegundos(5);

      await dialog.accept();
      console.log("Diálogo aceptado.");
    });

    await esperarSegundos(5);
    console.log("Esperando encontrar idCaptchaButton...");

    await page.waitForSelector("#idCaptchaButton");
    console.log("Selector del botón de captcha encontrado.");

    console.log("Esperando 5 segundos...");
    await esperarSegundos(5);

    await page.click("#idCaptchaButton");
    console.log("Botón de captcha clickeado.");
  } catch (error) {
    console.error("No hay turnos :'() :", error);
    console.log("Captura de pantalla guardada como no-hay-turnos0.png");
    await page.screenshot({ path: "./no-hay-turnos0.png" });
    if (browser) await browser.close();

    return { hayturnos: false };
  }

  try {
    await esperarSegundos(60);

    console.log("revisando si hay turnos.");
    // Espera a que el componente aparezca
    await page.waitForSelector(
      'div[style="text-align: center; font-size: 1.500em; font-weight: bold;"]',
      {
        timeout: 20000, // tiempo de espera en milisegundos
      }
    );

    console.log("No hay turno :'(");

    console.log("Captura de pantalla guardada como no-hay-turnos1.png");
    await page.screenshot({ path: "./no-hay-turnos1.png" });

    console.log("Proceso completado con éxito.");
    return { hayturnos: false };
  } catch (error) {
    console.error("Hay turnoooossss :", error);
    console.log("Captura de pantalla guardada como si-hay-turnosssss.png");
    await page.screenshot({ path: "./si-hay-turnosssss.png" });

    return { hayturnos: true };
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = {
  VerificarSiHayTurnos,
  esperarSegundos,
  VerificarMision,
};

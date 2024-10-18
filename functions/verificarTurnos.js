import {
  LaunchBrowser,
  InformameHayTurnosss,
  EsperarSegundos,
} from "../utils/common.js";

async function VerificarSiHayTurnos(screenshotsDir, sinBrowser = true) {
  console.log("Iniciando proceso para sacar cita...");
  let browser, page;
  browser = await LaunchBrowser({ headless: sinBrowser });

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
    await EsperarSegundos(5);
    await page.click(
      'a[href="https://www.citaconsular.es/es/hosteds/widgetdefault/2bc271dfe25b4c2dc909d105a21abff93"]'
    );
    console.log("Enlace de cita clickeado.");

    console.log("Esperando 5 segundos...");

    console.log("Dialog aceptado.");

    page.on("dialog", async (dialog) => {
      console.log("Diálogo detectado: " + dialog.message());
      await EsperarSegundos(5);

      await dialog.accept();
      console.log("Diálogo aceptado.");
    });

    await EsperarSegundos(5);
    console.log("Esperando encontrar idCaptchaButton...");

    await page.waitForSelector("#idCaptchaButton", { timeout: 180000 });
    console.log("Selector del botón de captcha encontrado.");

    console.log("Esperando 5 segundos...");
    await EsperarSegundos(5);

    await page.click("#idCaptchaButton");
    console.log("Botón de captcha clickeado.");
  } catch (error) {
    console.error("No hay turnos :'() :", error);
    console.log("Captura de pantalla guardada como no-hay-turnos0.png");
    await page.screenshot({ path: screenshotsDir + "/no-hay-turnos0.png" });
    if (browser) await browser.close();

    return { hayturnos: false };
  }

  try {
    await EsperarSegundos(60);

    console.log("revisando si hay turnos.");
    // Espera a que el componente aparezca
    await page.waitForSelector(
      'div[style="text-align: center; font-size: 1.500em; font-weight: bold;"]',
      {
        timeout: 60000, // tiempo de espera en milisegundos
      }
    );

    console.log("No hay turno :'(");

    console.log("Captura de pantalla guardada como no-hay-turnos1.png");
    await page.screenshot({ path: screenshotsDir + "/no-hay-turnos1.png" });

    console.log("Proceso completado con éxito.");
    return { hayturnos: false };
  } catch (error) {
    console.error("Hay turnoooossss :", error);
    console.log("Captura de pantalla guardada como si-hay-turnosssss.png");
    await page.screenshot({ path: screenshotsDir + "/si-hay-turnosssss.png" });
    InformameHayTurnosss();
    if (sinBrowser) await VerificarSiHayTurnos(screenshotsDir, false);
    return { hayturnos: true };
  } finally {
    if (browser && sinBrowser) await browser.close();
  }
}

export { VerificarSiHayTurnos };

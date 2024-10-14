import {
  LaunchBrowser,
  InformameHayTurnosss,
  EsperarSegundos,
} from "../utils/common.js";

async function VerificarMision() {
  console.log("Iniciando proceso para verificacion de mision...");
  let browser, page;

  browser = await LaunchBrowser();

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
    await EsperarSegundos(5);
    console.log("Esperando 5 segundos...");

    const existeTexto = await page.evaluate(() => {
      // Busca el elemento que contiene el texto específico
      const element = document.querySelector("span > strong + span");
      return element && element.textContent.includes("Fecha a confirmar");
    });

    await page.evaluate(() => {
      window.scrollBy(0, 1000);
    });

    if (existeTexto) {
      console.log("Captura de pantalla guardada como no-hay-fecha.mision.png");
      await page.screenshot({ path: "./no-hay-fecha.mision.png" });
      return { hayFechaDeMision: false };
    }

    console.log("Captura de pantalla guardada como hay-fecha-mision.png");
    await page.screenshot({ path: "./hay-fecha-mision.png" });
    InformameHayTurnosss();
    return { hayFechaDeMision: true };
  } catch (error) {
    console.error("Error al lanzar el navegador: ", error);
    if (browser) await browser.close();
    return { hayturnos: false };
  }
}

export { VerificarMision };

import twilio from "twilio";
import {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_CONTENT_SID,
  TWILIO_FROM,
  TWILIO_TO,
} from "./envs.js";

const accountSid = TWILIO_ACCOUNT_SID; // Tu Account SID de Twilio
const authToken = TWILIO_AUTH_TOKEN; // Tu Auth Token de Twilio
const client = twilio(accountSid, authToken);

/**
 * Envía un mensaje de WhatsApp.
 * @param  results - El contenido del mensaje.
 * @returns {Promise} - Una promesa que se resuelve cuando el mensaje se ha enviado.
 */
async function SendWhatsAppMessage(results) {
  console.log("[SendWhatsAppMessage] Enviando mensaje de WhatsApp...");
  // console.log("[SendWhatsAppMessage] body:   ", results);

  const whatsappMessage = `fecha: *{{1}}* Turno: *{{2}}* Mision *{{3}}*.
Resumen informativo.`;

  const variables = [results[results.length - 1]].reduce((acc, result, i) => {
    acc[`${i + 1}`] = result.timestamp.toLocaleString();
    acc[`${i + 2}`] = result.turnos ? "SI" : "NO";
    acc[`${i + 3}`] = result.mision ? "SI" : "NO";

    return acc;
  }, {});

  return client.messages.create({
    body: whatsappMessage,
    from: "whatsapp:" + TWILIO_FROM, // Número de WhatsApp de Twilio
    to: `whatsapp:${TWILIO_TO}`,
    contentSid: TWILIO_CONTENT_SID,
    contentVariables: JSON.stringify(variables),
  });
}

export { SendWhatsAppMessage };

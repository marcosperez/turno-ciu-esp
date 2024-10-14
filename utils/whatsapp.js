// utils/whatsapp.js

import twilio from "twilio";
import {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_FROM,
  TWILIO_TO,
} from "./envs.js";

const accountSid = TWILIO_ACCOUNT_SID; // Tu Account SID de Twilio
const authToken = TWILIO_AUTH_TOKEN; // Tu Auth Token de Twilio
const client = twilio(accountSid, authToken);

/**
 * Envía un mensaje de WhatsApp.
 * @param {string} to - El número de teléfono del destinatario en formato E.164 (ej. +1234567890).
 * @param {string} body - El contenido del mensaje.
 * @returns {Promise} - Una promesa que se resuelve cuando el mensaje se ha enviado.
 */
function SendWhatsAppMessage(body) {
  return client.messages.create({
    body: body,
    from: "whatsapp:" + TWILIO_FROM, // Número de WhatsApp de Twilio
    to: `whatsapp:${TWILIO_TO}`,
  });
}

export { SendWhatsAppMessage };

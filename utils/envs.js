import dotenv from "dotenv";

dotenv.config();

const {
  APP_CORREO,
  APP_PASSWORD,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_FROM,
  TWILIO_TO,
  TWILIO_CONTENT_SID,
} = process.env;

export {
  APP_CORREO,
  APP_PASSWORD,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_FROM,
  TWILIO_TO,
  TWILIO_CONTENT_SID,
};

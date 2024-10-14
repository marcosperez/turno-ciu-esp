import nodemailer from "nodemailer";
import { APP_CORREO, APP_PASSWORD } from "./envs.js";

export async function enviarCorreo(subject, html, resultadosTabla) {
  // Configura el transporte de nodemailer
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true para 465, false para otros puertos
    auth: {
      user: APP_CORREO, // Reemplaza con tu correo
      pass: APP_PASSWORD, // Reemplaza con tu contraseña de aplicación
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Configura las opciones del correo
  let mailOptions = {
    from: APP_CORREO, // Reemplaza con tu correo
    to: APP_CORREO,
    subject: subject,
    html: html + "<br><br>" + resultadosTabla, // Usa la propiedad 'html' en lugar de 'text'
  };

  // Envía el correo
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado: " + info.response);
  } catch (error) {
    console.error("Error al enviar el correo: " + error);
  }
}

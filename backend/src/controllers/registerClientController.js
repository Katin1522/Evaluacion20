import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
import clientModel from "../models/client.js"; 
import { config } from "../config.js";

const registerClient = {};

registerClient.register = async (req, res) => {
  const { name, email, password, phone, age } = req.body;

  try {
   
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nombre, email y contraseña son obligatorios" });
    }

    
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Formato de email inválido" });
    }

  
    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }


    const existing = await clientModel.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "El cliente ya existe" });
    }

 
    const passwordHash = await bcryptjs.hash(password, 10);

  
    const newClient = new clientModel({
      name,
      email,
      password: passwordHash,
      phone,
      age,
     
    });

    await newClient.save();

  
    const verificationCode = crypto.randomBytes(3).toString("hex");

 
    const tokenCode = jsonwebtoken.sign(
      { email, verificationCode },
      config.JWT.secret,
      { expiresIn: "2h" }
    );

    res.cookie("verificationToken", tokenCode, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
    });

   
    
const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: config.email.email_user,  
    pass: config.email.email_pass,  
  },
});

const mailOptions = {
  from: config.email.email_user, 
  to: email,
  subject: "Código de verificación",
  text: `Tu código de verificación es: ${verificationCode}\nExpira en 2 horas.`,
};

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Error al enviar el correo", error });
      }
      console.log("Correo enviado: " + info.response);
    });

    res.status(201).json({
      message: "Cliente registrado. Verifica tu email con el código enviado.",
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: "Error al registrar el cliente", error });
  }
};


registerClient.verifyCodeEmail = async (req, res) => {
  const { requireCode } = req.body;
  const token = req.cookies.verificationToken;

  if (!token) {
    return res.status(401).json({ message: "No hay token de verificación" });
  }

  try {
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    const { email, verificationCode: storedCode } = decoded;

    if (requireCode !== storedCode) {
      return res.status(400).json({ message: "Código inválido" });
    }

    const client = await clientModel.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    client.isVerified = true;
    await client.save();

    res.clearCookie("verificationToken");

    res.json({ message: "Correo verificado correctamente" });
  } catch (error) {
    console.error("Error al verificar:", error);
    res.status(500).json({ message: "Error al verificar código", error });
  }
};

export default registerClient;

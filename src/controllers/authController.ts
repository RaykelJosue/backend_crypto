import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Usuario } from "../entities/Usuario";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Registro de usuario
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email y contraseña son requeridos." });
    return;
  }

  try {
    const userRepository = AppDataSource.getRepository(Usuario);
    const existingUser = await userRepository.findOneBy({ email });

    if (existingUser) {
      res.status(400).json({ message: "El usuario ya existe." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = userRepository.create({ email, password: hashedPassword });
    await userRepository.save(nuevoUsuario);

    res.status(201).json({ message: "Usuario registrado correctamente." });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
};

/**
 * Inicio de sesión y generación de JWT
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email y contraseña son requeridos." });
    return;
  }

  try {
    const userRepository = AppDataSource.getRepository(Usuario);
    const user = await userRepository.findOneBy({ email });

    if (!user) {
      res.status(401).json({ message: "Credenciales inválidas." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Credenciales inválidas." });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" } // Expira en 1 hora
    );

    res.json({ message: "Login exitoso.", token });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
};

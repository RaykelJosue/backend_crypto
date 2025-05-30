import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * 🔹 Extiende la interfaz Request para incluir la propiedad 'user'
 */
interface CustomRequest extends Request {
  user?: any;
}

/**
 * 🔐 Middleware de autenticación con JWT
 */
export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded; // Guarda la información del usuario en la petición
    next(); // Permite el acceso al siguiente middleware o controlador
  } catch (error) {
    res.status(403).json({ message: "Token inválido o expirado." });
  }
};

import { Router } from "express";
import { register, login } from "../controllers/authController";
import { verifyToken } from "../middlewares/authMiddleware";
import { Request } from "express";

declare global {
  namespace Express {
    export interface Request {
      user?: any;
    }
  }
}


/**
 * 🔹 Extiende Request para permitir acceder a req.user
 */
interface CustomRequest extends Request {
  user?: any;
}

const router = Router();

// 📝 Registro de usuario
router.post("/register", async (req, res) => {
  await register(req, res);
});

// 🔐 Login y generación de token JWT
router.post("/login", async (req, res) => {
  await login(req, res);
});

// 🔒 Endpoint protegido: Solo usuarios autenticados pueden acceder
router.get("/perfil", verifyToken, (req: CustomRequest, res) => {
  res.json({ message: "Acceso autorizado.", user: req.user });
});

export default router;

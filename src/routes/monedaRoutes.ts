import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { getMonedas, addMoneda } from "../controllers/monedaController";

const router = Router();

// 🔹 Obtener todas las monedas (Ruta protegida)
router.get("/", verifyToken, async (req, res) => {
  await getMonedas(req, res);
});

// 🔹 Agregar una nueva moneda (Ruta protegida)
router.post("/", verifyToken, async (req, res) => {
  await addMoneda(req, res);
});

export default router;

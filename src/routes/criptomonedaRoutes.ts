import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import {
  getCriptomonedas,
  getCriptomonedasPorMoneda,
  addCriptomonedaConMoneda,
  updateCriptomoneda,
  deleteCriptomoneda
} from "../controllers/criptomonedaController";

const router = Router();

// 🔹 Obtener todas las criptomonedas (Filtradas por moneda si se proporciona)
router.get("/", verifyToken, async (req, res) => {
  const { moneda } = req.query;
  if (moneda) {
    await getCriptomonedasPorMoneda(req, res);
  } else {
    await getCriptomonedas(req, res);
  }
});

// 🔹 Agregar una nueva criptomoneda vinculada a una moneda (Ruta protegida)
router.post("/", verifyToken, async (req, res) => {
  await addCriptomonedaConMoneda(req, res);
});

// 🔹 Modificar el precio de una criptomoneda por ID (Ruta protegida)
router.put("/:id", verifyToken, async (req, res) => {
  await updateCriptomoneda(req, res);
});

// 🔹 Eliminar una criptomoneda por ID (Ruta protegida)
router.delete("/:id", verifyToken, async (req, res) => {
  await deleteCriptomoneda(req, res);
});

export default router;
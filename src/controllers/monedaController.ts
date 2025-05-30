import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Moneda } from "../entities/Moneda";

/**
 * 🔹 Obtener todas las monedas
 */
export const getMonedas = async (req: Request, res: Response): Promise<void> => {
  try {
    const monedaRepository = AppDataSource.getRepository(Moneda);
    const monedas = await monedaRepository.find();
    res.json(monedas);
  } catch (error) {
    console.error("Error al obtener monedas:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
};

/**
 * 🔹 Agregar una nueva moneda
 */
export const addMoneda = async (req: Request, res: Response): Promise<void> => {
  const { nombre, codigo } = req.body;

  if (!nombre || !codigo) {
    res.status(400).json({ message: "Nombre y código son requeridos." });
    return;
  }

  try {
    const monedaRepository = AppDataSource.getRepository(Moneda);
    const existente = await monedaRepository.findOneBy({ codigo });

    if (existente) {
      res.status(400).json({ message: "La moneda ya existe." });
      return;
    }

    const nuevaMoneda = monedaRepository.create({ nombre, codigo });
    await monedaRepository.save(nuevaMoneda);
    res.status(201).json({ message: "Moneda agregada correctamente." });
  } catch (error) {
    console.error("Error al agregar moneda:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
};

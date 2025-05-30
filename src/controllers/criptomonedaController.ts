import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Criptomoneda } from "../entities/Criptomoneda";
import { Moneda } from "../entities/Moneda";

/**
 * 🔹 Obtener todas las criptomonedas (Filtradas por moneda si se proporciona)
 */
export const getCriptomonedas = async (req: Request, res: Response): Promise<void> => {
  try {
    const criptomonedaRepository = AppDataSource.getRepository(Criptomoneda);
    const criptomonedas = await criptomonedaRepository.find({ relations: ["moneda"] });
    res.json(criptomonedas);
  } catch (error) {
    console.error("Error al obtener criptomonedas:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
};

export const getCriptomonedasPorMoneda = async (req: Request, res: Response): Promise<void> => {
  const { moneda } = req.query;

  if (!moneda) {
    res.status(400).json({ message: "Debe proporcionar un código de moneda." });
    return;
  }

  try {
    const criptomonedaRepository = AppDataSource.getRepository(Criptomoneda);
    const monedaRepository = AppDataSource.getRepository(Moneda);

    const monedaEncontrada = await monedaRepository.findOneBy({ codigo: String(moneda) });

    if (!monedaEncontrada) {
      res.status(404).json({ message: "Moneda no encontrada." });
      return;
    }

    const criptomonedas = await criptomonedaRepository.find({
      where: { moneda: { id: monedaEncontrada.id } }, // Filtramos directamente por el ID
      relations: ["moneda"] 
    });    
    res.json(criptomonedas);    
  } catch (error) {
    console.error("Error al obtener criptomonedas por moneda:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
};

/**
 * 🔹 Agregar una nueva criptomoneda asignada a una moneda
 */
export const addCriptomonedaConMoneda = async (req: Request, res: Response): Promise<void> => {
  const { nombre, simbolo, precio, codigoMoneda } = req.body;

  if (!nombre || !simbolo || !precio || !codigoMoneda) {
    res.status(400).json({ message: "Nombre, símbolo, precio y código de moneda son requeridos." });
    return;
  }

  try {
    const criptomonedaRepository = AppDataSource.getRepository(Criptomoneda);
    const monedaRepository = AppDataSource.getRepository(Moneda);

    const monedaEncontrada = await monedaRepository.findOneBy({ codigo: codigoMoneda });

    if (!monedaEncontrada) {
      res.status(404).json({ message: "Moneda no encontrada." });
      return;
    }

    const existente = await criptomonedaRepository.findOneBy({ simbolo });

    if (existente) {
      res.status(400).json({ message: "La criptomoneda ya existe." });
      return;
    }

    const nuevaCriptomoneda = criptomonedaRepository.create({
      nombre,
      simbolo,
      precio,
      moneda: monedaEncontrada
    });

    await criptomonedaRepository.save(nuevaCriptomoneda);
    res.status(201).json({ message: "Criptomoneda creada y vinculada a moneda correctamente." });
  } catch (error) {
    console.error("Error al crear criptomoneda:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
};

/**
 * 🔹 Modificar el precio de una criptomoneda
 */
export const updateCriptomoneda = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { precio } = req.body;

  if (!precio) {
    res.status(400).json({ message: "El precio es requerido." });
    return;
  }

  try {
    const criptomonedaRepository = AppDataSource.getRepository(Criptomoneda);
    const criptomoneda = await criptomonedaRepository.findOneBy({ id: Number(id) });

    if (!criptomoneda) {
      res.status(404).json({ message: "Criptomoneda no encontrada." });
      return;
    }

    criptomoneda.precio = precio;
    await criptomonedaRepository.save(criptomoneda);
    res.json({ message: "Criptomoneda actualizada correctamente." });
  } catch (error) {
    console.error("Error al actualizar criptomoneda:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
};

/**
 * 🔹 Eliminar una criptomoneda
 */
export const deleteCriptomoneda = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const criptomonedaRepository = AppDataSource.getRepository(Criptomoneda);
    const criptomoneda = await criptomonedaRepository.findOneBy({ id: Number(id) });

    if (!criptomoneda) {
      res.status(404).json({ message: "Criptomoneda no encontrada." });
      return;
    }

    await criptomonedaRepository.remove(criptomoneda);
    res.json({ message: "Criptomoneda eliminada correctamente." });
  } catch (error) {
    console.error("Error al eliminar criptomoneda:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
};

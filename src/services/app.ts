import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import authRoutes from "../routes/authRoutes";
import { AppDataSource } from "../config/data-source";
import criptomonedaRoutes from "../routes/criptomonedaRoutes";
import monedaRoutes from "../routes/monedaRoutes";
import { replicarDatosHistoricos } from "../services/replicacionService"; // ✅ Ruta corregida

dotenv.config();

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/criptomoneda", criptomonedaRoutes);
app.use("/moneda", monedaRoutes);

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log("🟢 Conexión a la base de datos exitosa");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
      
      // 🔹 Ejecutar la replicación de datos históricos cada 24 horas
      setInterval(async () => {
        await replicarDatosHistoricos();
      }, 24 * 60 * 60 * 1000);
    });
  })
  .catch((error) => console.error("❌ Error al conectar la base de datos:", error));

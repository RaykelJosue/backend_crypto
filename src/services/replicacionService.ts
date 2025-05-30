import { AppDataSource } from "../config/data-source";
import { Criptomoneda } from "../entities/Criptomoneda";
import { EntityManager, LessThan } from "typeorm";

export const replicarDatosHistoricos = async (): Promise<void> => {
  console.log("🔁 Iniciando replicación de datos históricos...");

  try {
    // 🔹 Verificar si la conexión con la base de datos está inicializada
    if (!AppDataSource.isInitialized) {
      console.log("🔄 Conectando a la base de datos...");
      await AppDataSource.initialize();
      console.log("✅ Conexión establecida correctamente.");
    }

    const entityManager: EntityManager = AppDataSource.manager;

    // 🔹 Filtrar registros antiguos (más de 6 meses)
    const fechaLimite = new Date();
    fechaLimite.setMonth(fechaLimite.getMonth() - 6);
    console.log(`📅 Filtrando registros anteriores a: ${fechaLimite.toISOString()}`);

    const criptomonedasAntiguas = await entityManager.find(Criptomoneda, {
      where: { creada_en: LessThan(fechaLimite) },
      relations: ["moneda"]
    });

    console.log(`🔎 Registros encontrados: ${criptomonedasAntiguas.length}`);

    if (criptomonedasAntiguas.length === 0) {
      console.log("✅ No hay datos antiguos para replicar.");
      return;
    }

    // 🔹 Mover registros a la tabla `historico_criptomonedas`
    for (const cripto of criptomonedasAntiguas) {
      console.log(`📦 Moviendo ${cripto.nombre} (${cripto.simbolo}) a historico_criptomonedas...`);

      const resultadoInsert = await entityManager.query(
        `INSERT INTO historico_criptomonedas (nombre, simbolo, precio, moneda_id, fecha_movimiento) VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
        [cripto.nombre, cripto.simbolo, cripto.precio, cripto.moneda.id]
      );

      console.log(`✅ Registro movido exitosamente:`, resultadoInsert);

      // 🔹 Eliminar registro original después de moverlo
      const resultadoDelete = await entityManager.delete(Criptomoneda, { id: cripto.id });
      console.log(`🗑️ Registro eliminado de criptomonedas:`, resultadoDelete);
    }

    console.log(`✅ ${criptomonedasAntiguas.length} registros movidos a historico_criptomonedas.`);
  } catch (error) {
    console.error("❌ Error en la replicación:", error);
  }
};

if (require.main === module) {
  replicarDatosHistoricos();
}
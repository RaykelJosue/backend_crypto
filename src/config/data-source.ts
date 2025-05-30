import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Usuario } from "../entities/Usuario";  
import { Criptomoneda } from "../entities/Criptomoneda";
import { Moneda } from "../entities/Moneda";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true, // Para desarrollo: crea tablas automáticamente
  logging: false,
  entities: [Usuario, Criptomoneda, Moneda]
});

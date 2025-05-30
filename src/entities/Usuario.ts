import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("usuarios") // Esto garantiza que TypeORM registre bien la entidad
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @CreateDateColumn({ type: "timestamp" }) // Especifica el tipo
  creadoEn!: Date;
}
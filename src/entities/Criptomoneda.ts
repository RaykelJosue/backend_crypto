import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { Moneda } from "./Moneda";

@Entity()
export class Criptomoneda {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  nombre!: string;

  @Column({ unique: true, length: 10 })
  simbolo!: string;

  @Column("decimal", { precision: 18, scale: 8 })
  precio!: number;

  @CreateDateColumn({ name: "creada_en" })
  creada_en!: Date;

  @ManyToOne(() => Moneda, (moneda) => moneda.id, { onDelete: "CASCADE" })
  moneda!: Moneda;
}

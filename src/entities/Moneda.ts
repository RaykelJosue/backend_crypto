import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Moneda {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  nombre!: string;

  @Column({ unique: true, length: 5 })
  codigo!: string;

  @CreateDateColumn()
  creadaEn!: Date;
}

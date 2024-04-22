import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Bien } from './bien.entity';

@Entity()
export class Departement {
    
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Bien, bien => bien.departement)
  biens: Bien[];
}

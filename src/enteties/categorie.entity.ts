import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Bien } from './bien.entity';
import { SousCategorie } from './sous-categorie.entity';

@Entity()
export class Categorie {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
 
  @OneToMany(() => Bien, bien => bien.categorie)
  biens: Bien[];

  @OneToMany(() => SousCategorie, sousCategorie => sousCategorie.categorie)
  sousCategories: SousCategorie[];
}

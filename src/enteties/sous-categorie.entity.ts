import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Categorie } from './categorie.entity';
import { Bien } from './bien.entity'; // Importer l'entité Bien

@Entity()
export class SousCategorie {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  
  @ManyToOne(() => Categorie, categorie => categorie.sousCategories)
  categorie: Categorie;

  @OneToMany(() => Bien, bien => bien.sousCategorie) // Relation inverse avec Bien
  biens: Bien[]; // Ajouter cette ligne
}

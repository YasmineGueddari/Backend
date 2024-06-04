import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Categorie } from './categorie.entity';
import { Bien } from './bien.entity'; // Importer l'entité Bien

@Entity()
export class SousCategorie {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;


  @Column({ default: true }) // Par défaut, isActive est true
    isActive: boolean;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
  
  @ManyToOne(() => Categorie, categorie => categorie.sousCategories)
  categorie: Categorie;

  @OneToMany(() => Bien, bien => bien.sousCategorie) // Relation inverse avec Bien
  biens: Bien[]; // Ajouter cette ligne
}

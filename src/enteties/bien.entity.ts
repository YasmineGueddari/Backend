import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Departement } from './departement.entity';
import { Categorie } from './categorie.entity';
import { SousCategorie } from './sous-categorie.entity'; // Importer l'entité SousCategorie

@Entity()
export class Bien {

    @PrimaryGeneratedColumn()
    id: number ;

    @Column({ type: 'text', nullable: true })
    name: String;
    
    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'text', default: true })
    statut: string;

    @ManyToOne(() => Departement, departement => departement.biens)
    departement: Departement;
  
    @ManyToOne(() => Categorie, categorie => categorie.biens)
    categorie: Categorie;

    @ManyToOne(() => SousCategorie, sousCategorie => sousCategorie.biens) // Relation avec SousCategorie
    sousCategorie: SousCategorie; // Ajouter cette ligne
}

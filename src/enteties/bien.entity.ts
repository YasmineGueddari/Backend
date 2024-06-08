import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Departement } from './departement.entity';
import { Categorie } from './categorie.entity';
import { SousCategorie } from './sous-categorie.entity'; // Importer l'entité SousCategorie
import { Reservation } from './reservation.entity';
import { Reclamation } from './reclamation.entity';

@Entity()
export class Bien {

    @PrimaryGeneratedColumn()
    id: number ;

    @Column({ type: 'text', nullable: true })
    name: String;
    
    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ default: true })
    statut: boolean;

    @Column({ type: 'text', nullable: true })
    image: string;

    @Column({ default: false })
    requiresConfirmation: boolean;

    @Column({ default: true }) // Par défaut, isActive est true
    isActive: boolean;

    

    @CreateDateColumn({ name: 'createdAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;



    @ManyToOne(() => Departement, departement => departement.biens)
    departement: Departement;
  
    @ManyToOne(() => Categorie, categorie => categorie.biens)
    categorie: Categorie;

    @ManyToOne(() => SousCategorie, sousCategorie => sousCategorie.biens) // Relation avec SousCategorie
    sousCategorie: SousCategorie; // Ajouter cette ligne

   
    // @ManyToMany(() => Reservation, reservation => reservation.biens)
    // reservations: Reservation[];
    @OneToMany(() => Reservation, (reservation) => reservation.bien)
    reservations: Reservation[];

    @OneToMany(() => Reclamation, reclamation => reclamation.bien)
    reclamations: Reclamation[];


}

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Reservation {

    @PrimaryGeneratedColumn()
    id: number ;

    @Column({ type: 'text', nullable: true })
    date_debut: Date | null;
    
    @Column({ type: 'text', nullable: true })
    date_fin: Date | null;

    @Column({ type: 'text', default: true })
    statut: string;
}

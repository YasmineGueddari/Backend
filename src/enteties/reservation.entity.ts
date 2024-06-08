import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Bien } from "./bien.entity";
import { User } from "./user.entity";
import { ReservationStatus } from "src/common/enum/reservation-status.enum";
import { Reclamation } from "./reclamation.entity";
import { Notification } from './notification.entity';

@Entity()
export class Reservation {

    @PrimaryGeneratedColumn()
    id: number ;

    @Column({ type: 'timestamp' })
    date_debut: Date;

    @Column({ type: 'timestamp' })
    date_fin: Date;

    @Column({ type: 'enum', enum: ReservationStatus, default: ReservationStatus.PENDING })
    statut: ReservationStatus;


    @Column({ default: true }) // Par défaut, isActive est true
    isActive: boolean;

    @CreateDateColumn({ name: 'createdAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    

    // @ManyToMany(() => Bien, bien => bien.reservations)
    // @JoinTable()  // This decorator is used to create the junction table
    // biens: Bien[];

    @ManyToOne(() => Bien, (bien) => bien.reservations)
    bien: Bien;
  
    @ManyToOne(() => User)
    user: User;

    @OneToMany(() => Reclamation, reclamation => reclamation.reservation)
    reclamations: Reclamation[];

    @OneToMany(() => Notification, notification => notification.reservation)
    notifications: Notification[];

}

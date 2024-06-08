import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Reservation } from "./reservation.entity";
import { Bien } from "./bien.entity";
import { ReclamationStatus } from "src/common/enum/reclamation-status.enum";

@Entity()
export class Reclamation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ default: true }) // Par défaut, isActive est true
  isActive: boolean;

  @Column({ type: 'enum', enum: ReclamationStatus, default: ReclamationStatus.PENDING })
  statut: ReclamationStatus;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Reservation)
  reservation: Reservation;

  @ManyToOne(() => Bien)
  bien: Bien;


}
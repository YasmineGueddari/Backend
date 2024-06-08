import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt'
import { Succursale } from "./succursale.entity";
import { Reservation } from "./reservation.entity";
import { Reclamation } from "./reclamation.entity";
import { Notification } from './notification.entity';
import { Role } from "src/common/enum/role.enum";

@Entity()
@Unique(['email'])
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: true })
    firstName: string;

    @Column({ type: 'text', nullable: true })
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ type: 'text', nullable: true })
    phone: string;

    @Column({ type: 'text', nullable: true }) // Si le rôle est stocké en tant que texte
    role: Role;

    @Column()
    salt: string;

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }

    @Column({ type: 'text', nullable: true })
    image: string;

    @Column({ default: true }) // Par défaut, isActive est true
    isActive: boolean;

    @CreateDateColumn({ name: 'createdAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToMany(() => Succursale, succursale => succursale.users)
    @JoinTable({ name: 'user_succursale' })
    succursales: Succursale[];

    @OneToMany(() => Reservation, reservation => reservation.user)
    reservations: Reservation[];

    @OneToMany(() => Reclamation, reclamation => reclamation.user)
    reclamations: Reclamation[];

    @ManyToMany(() => Notification, notification => notification.users)
    @JoinTable({ name: 'user_notification' }) // Utilisez un objet pour spécifier le nom de la table de jointure
    notifications: Notification[];
}

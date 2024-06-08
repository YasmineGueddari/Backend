import { BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Reservation } from './reservation.entity';
import { Type } from 'src/common/enum/type.enum';
import { IsEnum } from 'class-validator';


@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column({type: "enum",enum: Type,})
  title: Type;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @ManyToMany(() => User, user => user.notifications)
  users: User[];
  
  @ManyToOne(() => Reservation, reservation => reservation.notifications)
  reservation: Reservation;
}

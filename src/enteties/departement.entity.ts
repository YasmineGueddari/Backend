import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Bien } from './bien.entity';
import { Succursale } from './succursale.entity';

@Entity()
export class Departement {
    
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
    

  @OneToMany(() => Bien, bien => bien.departement)
  biens: Bien[];

  @ManyToOne(() => Succursale, succursale => succursale.departements)
     succursale: Succursale;
}

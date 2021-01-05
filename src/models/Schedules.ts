import {
  Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn,
} from 'typeorm';
import Talent from './Talents';

@Entity('schedules')
export class Schedules {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  id_provider: string

  @Column()
  id_contractor: string

  @OneToOne((type) => Talent)
  @JoinColumn()
  talent: Talent;

  @Column('timestamp')
  date: Date
}

export default Schedules;

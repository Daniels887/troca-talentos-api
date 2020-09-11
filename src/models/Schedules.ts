import {
  Entity, PrimaryGeneratedColumn, Column,
} from 'typeorm';

@Entity('schedules')
export class Schedules {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  id_provider: string

  @Column()
  id_contractor: string

  @Column('timestamp')
  date: Date
}

export default Schedules;

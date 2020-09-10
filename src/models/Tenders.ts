import {
  Entity, PrimaryGeneratedColumn, Column,
} from 'typeorm';

@Entity('tenders')
export class Tenders {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  id_provider: string

  @Column()
  id_contractor: string

  @Column('integer')
  tcoin: number

  @Column('timestamp')
  date: Date
}

export default Tenders;

import {
  Entity, PrimaryGeneratedColumn, Column,
} from 'typeorm';

@Entity('proposals')
export class Proposals {
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

  @Column()
  accepted: Boolean
}

export default Proposals;

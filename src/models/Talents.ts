import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
} from 'typeorm';
import { User } from './Users';

@Entity('talents')
export class Talents {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  talent: string

  @Column()
  banner: string

  @Column()
  rating: number

  @Column()
  description: string

  @Column()
  tcoin: number

  @ManyToOne((type) => User, (talents) => Talents, { eager: true })
  user: User
}

export default Talents;

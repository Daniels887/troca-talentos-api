import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from './Users';

@Entity('talents')
export class Talents {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  talent: string

  @ManyToOne((type) => User, (talents) => Talents, { eager: true })
  user: User
}

export default Talents;

import {
  Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany,
} from 'typeorm';
import bcrypt from 'bcryptjs';
import Talents from './Talents';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  username: string

  @Column()
  email: string

  @Column()
  password: string

  @Column('integer')
  tcoin: number

  @Column()
  avatar: string

  @Column()
  age: number

  @OneToMany((type) => Talents, (user) => User)
  talents: Talents[]

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }
}

export default User;

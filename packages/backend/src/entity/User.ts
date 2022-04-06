import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProjectMember } from './ProjectMember';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column()
  status: string;
  @Column()
  picture: string;
  @CreateDateColumn()
  createdAt: Timestamp;
  @UpdateDateColumn()
  updatedAt: Timestamp;

  @OneToMany(() => ProjectMember, (pm) => pm.user)
  public projects?: ProjectMember[];
}

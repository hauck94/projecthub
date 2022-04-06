import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from './Project';
import { User } from './User';

@Entity()
export class ProjectMember {
  @PrimaryColumn()
  public projectId!: number;

  @ManyToOne(() => Project, (project) => project.members) // inverse "userPlaces: UserPlace[]" is one-to-many in user
  @JoinColumn({ name: 'projectId' })
  public project: Project;

  @PrimaryColumn()
  public userId!: number;

  @ManyToOne(() => User, (user) => user.projects) // inverse "userPlaces: UserPlace[]" is one-to-many in place
  @JoinColumn({ name: 'userId' })
  public user: User;

  @Column()
  public permission: string;

  constructor(project: Project, user: User, permission: string) {
    this.project = project;
    this.user = user;
    this.permission = permission;
  }
}

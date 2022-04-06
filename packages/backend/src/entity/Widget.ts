import { Column, CreateDateColumn, Entity, PrimaryColumn, Timestamp, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Project } from './Project';

@Entity()
export class Widget {
  @PrimaryColumn()
  id: string;
  @Column()
  type: string;
  @Column({ nullable: true })
  xPos?: number;
  @Column({ nullable: true })
  yPos?: number;
  @Column({ nullable: true })
  height?: number;
  @Column({ nullable: true })
  width?: number;
  @Column({ type: 'text', nullable: true })
  data?: string;
  @CreateDateColumn()
  createdAt: Timestamp;
  @UpdateDateColumn()
  updatedAt: Timestamp;

  @ManyToOne(() => Project, (project) => project.widgets)
  project: Project;

  constructor(
    id: string,
    type: string,
    project: Project,
    xPos?: number,
    yPos?: number,
    height?: number,
    width?: number,
    data?: string,
  ) {
    this.id = id;
    this.type = type;
    this.project = project;
    this.xPos = xPos;
    this.yPos = yPos;
    this.height = height;
    this.width = width;
    this.data = data;
  }
}

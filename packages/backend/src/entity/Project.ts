import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
  OneToMany,
  getRepository,
} from 'typeorm';
import { ProjectMember } from './ProjectMember';
import { Widget } from './Widget';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ type: 'text', nullable: true })
  description: string;
  @Column({ nullable: true })
  active: boolean;
  @Column({ nullable: true })
  open: boolean;
  @Column('text', { nullable: true })
  labels: string;
  @Column({ type: 'text', nullable: true })
  picture: string;
  @Column({ type: 'text', nullable: true })
  backgroundColor: string;
  @CreateDateColumn()
  createdAt: Timestamp;
  @UpdateDateColumn()
  updatedAt: Timestamp;

  @OneToMany(() => ProjectMember, (pm) => pm.project)
  public members?: ProjectMember[];

  @OneToMany(() => Widget, (widget) => widget.project, { onDelete: 'CASCADE' })
  widgets: Widget[];

  clearWidgets = async () => {
    if (this.widgets) {
      this.widgets.splice(0, this.widgets.length);
    }
  };

  updateWidget = async (updateWidget: Widget) => {
    // var i = Number(updateWidget.id);
    const widgetRepo = getRepository(Widget);
    const widget = await widgetRepo.findOneOrFail(updateWidget.id);
    // const widget = await widgetRepo.findOneOrFail({where: {id: i}});

    widget.data = String(updateWidget.data);
    widget.type = updateWidget.type;
    widget.height = updateWidget.height;
    widget.width = updateWidget.width;
    widget.xPos = updateWidget.xPos;
    widget.yPos = updateWidget.yPos;

    await widgetRepo.save(widget);

    if (this.widgets) {
      this.widgets.push(widget);
    }
  };
}

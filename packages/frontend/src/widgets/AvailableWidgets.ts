import { WidgetInfo } from '../models/WidgetInfo';
import LinkWidget from './Link/LinkWidget';
import TodoWidget from './Todo/TodoWidget';
import { LinkWidgetInfo } from './Link/LinkWidgetModel';
import { TodoWidgetInfo } from './Todo/TodoWidgetModel';
import Widget from '../components/Widget';
import ExampleWidget from './Example/ExampleWidget';
import { ExampleWidgetInfo } from './Example/ExampleWidgetModel';
import { IssueWidgetInfo } from './Issue/IssueWidgetModel';
import IssueWidget from './Issue/IssueWidget';
import { BranchWidgetInfo } from './Branch/BranchWidgetModel';
import BranchWidget from './Branch/BranchWidget';
import { NotesWidgetInfo } from './Notes/NotesWidgetModel';
import NotesWidget from './Notes/NotesWidget';

export const availableWidgets: {
  [key: string]: { info: WidgetInfo; component: Widget<any> };
} = {
  todo: { info: TodoWidgetInfo, component: TodoWidget },
  notes: { info: NotesWidgetInfo, component: NotesWidget },
  link: { info: LinkWidgetInfo, component: LinkWidget },
  example: { info: ExampleWidgetInfo, component: ExampleWidget },
  issue: { info: IssueWidgetInfo, component: IssueWidget },
  branch: { info: BranchWidgetInfo, component: BranchWidget },
};

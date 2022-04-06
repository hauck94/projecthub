import { WidgetInfo } from '../../models/WidgetInfo';
import * as Settings from '../../models/WidgetSettings';

export interface TodoWidgetData {
  title: string;
  todos?: string[];
  backgroundColor: string;
  fontColor: string;
}

export const TodoWidgetInfo: WidgetInfo = {
  type: 'todo',
  name: 'Todo',
  displayMode: 'all',
  size: [
    { width: 2, height: 2 },
    { width: 2, height: 3 },
    { width: 3, height: 3 },
  ],
  settings: {
    title: new Settings.TextField({ name: 'Title' }),
    backgroundColor: new Settings.ColorPicker({ name: 'Background Color', default: '#88a8db' }),
    fontColor: new Settings.ColorPicker({ name: 'Font Color', default: 'black' }),
  },
};

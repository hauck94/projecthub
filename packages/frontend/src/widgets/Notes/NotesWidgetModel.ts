import { WidgetInfo } from '../../models/WidgetInfo';
import * as Settings from '../../models/WidgetSettings';

export interface NotesWidgetData {
  backgroundColor: string;
  token: string;
}

export const NotesWidgetInfo: WidgetInfo = {
  type: 'notes',
  name: 'Notes',
  size: [
    { width: 2, height: 2 },
    { width: 3, height: 3 },
  ],
  displayMode: 'all',
  settings: {
    backgroundColor: new Settings.ColorPicker({ name: 'Background Color', default: '#fcd059' }),
  },
};

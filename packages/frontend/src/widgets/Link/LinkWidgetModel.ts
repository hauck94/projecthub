import { WidgetInfo } from '../../models/WidgetInfo';
import * as Settings from '../../models/WidgetSettings';

export interface LinkWidgetData {
  title: string;
  url: string;
  backgroundColor: string;
  fontColor: string;
  logo?: string;
}

export const LinkWidgetInfo: WidgetInfo = {
  type: 'link',
  name: 'Link',
  size: [{ width: 1, height: 1 }],
  displayMode: 'all',
  settings: {
    url: new Settings.TextField({
      description: 'place the url of your target website / content here',
      name: 'URL',
      placeholder: 'enter your target url here',
      required: true,
    }),
    title: new Settings.TextField({ name: 'Title', required: true }),
    logo: new Settings.TextField({ name: 'Logo', placeholder: 'url of your logo image' }),
    backgroundColor: new Settings.ColorPicker({ name: 'Background Color', default: 'black' }),
    fontColor: new Settings.ColorPicker({ name: 'Font Color', default: 'white' }),
  },
};

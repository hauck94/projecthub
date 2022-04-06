import { WidgetInfo } from '../../models/WidgetInfo';
import * as Settings from '../../models/WidgetSettings';

export interface ExampleWidgetData {
  counter: number;
  title: string;
  backgroundColor: string;
}

export const ExampleWidgetInfo: WidgetInfo = {
  type: 'example',
  name: 'Example',
  displayMode: 'all',
  size: [
    { width: 1, height: 1 },
    { width: 2, height: 1 },
  ],
  description: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
  et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
  Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit
  amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
  aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
  gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`,
  url: 'http://example.org',
  author: 'John Doe',
  authorUrl: 'http://example.org',
  licence: 'Apache 2.0',
  labels: ['example', 'basic', 'counter'],
  settings: {
    title: new Settings.TextField({
      name: 'Title',
      placeholder: 'enter your counter name here',
      description: 'this title is displayed above your counter',
      required: true,
    }),
    backgroundColor: new Settings.ColorPicker({ name: 'Background Color', default: 'blue' }),
  },
};

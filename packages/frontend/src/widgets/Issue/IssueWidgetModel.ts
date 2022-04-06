import { WidgetInfo } from '../../models/WidgetInfo';
import * as Settings from '../../models/WidgetSettings';

// Issues Data based on https://docs.gitlab.com/ee/api/issues.html
export interface IssueData {
  issueId: string;
  title: string;
  state: string;
  creator: string;
  labels: string[];
}

export interface IssueWidgetData {
  url: string;
  apiVersion: string;
  projectId: string;
  accessToken: string;
  backgroundColor: string;
  fontColor: string;
}

// TODO: change to required false
export const IssueWidgetInfo: WidgetInfo = {
  type: 'issue',
  name: 'Issue',
  size: [{ width: 7, height: 3 }],
  displayMode: 'all',
  settings: {
    url: new Settings.TextField({
      description: 'place the api url of the repository',
      name: 'API URL',
      placeholder: 'e.g. https://code.fbi.h-da.de/api/v4/projects',
      required: false,
    }),
    // TODO: create small and medium textfield
    apiVersion: new Settings.TextField({
      name: 'API Version',
      placeholder: 'e.g. 4',
      required: false,
    }),
    projectId: new Settings.TextField({
      name: 'Project Id',
      required: false,
    }),
    accessToken: new Settings.TextField({
      name: 'Access Token TODO',
      required: false,
    }),
    backgroundColor: new Settings.ColorPicker({ 
      name: 'Background Color', 
      default: '#c0e6eb' }),
    fontColor: new Settings.ColorPicker({ 
      name: 'Font Color', 
      default: 'black' 
    })
  },
};

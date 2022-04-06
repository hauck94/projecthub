import { WidgetInfo } from '../../models/WidgetInfo';
import * as Settings from '../../models/WidgetSettings';

// Branch Data based on https://docs.gitlab.com/ee/api/branches.html
export interface BranchData {
  name: string,
  mergedIntoMaster: boolean,
  lastCommit: string,
  lastCommitMessage: string,
  lastCommitDeveloper: string,
  url: string
}

export interface BranchWidgetData {
  url: string;
  apiVersion: string;
  projectId: string;
  accessToken: string;
  backgroundColor: string;
  fontColor: string;
}

// TODO: change to required true
export const BranchWidgetInfo: WidgetInfo = {
  type: 'branch',
  name: 'Branch',
  size: [
    { width: 8, height: 3 },
  ],
  displayMode: 'all',
  settings: {
    url: new Settings.TextField({
      description: 'place the api url of the repository',
      name: 'API URL',
      placeholder: 'e.g. https://code.fbi.h-da.de',
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
        default: '#e9c0eb' }),
    fontColor: new Settings.ColorPicker({ 
        name: 'Font Color', 
        default: 'black' 
    })
  },
};

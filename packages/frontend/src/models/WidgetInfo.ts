import { SettingType } from './WidgetSettings';

// WIDGET INFO
// Contains all static information about the widget.
// None of these information can be changed dynamically.
// This information is used by the application to correctly load and display the widget.
export interface WidgetInfo {
  type: string; // the type is used to identify the widget type across the application
  name: string; // The name attribute is used as the client-facing widget-name seen by the user
  size: { width: number; height: number }[]; // the size attribute represents the possible sizes the widget can be in
  displayMode: 'all' | 'desktop' | 'mobile'; // the displayMode is used to determine if the widget may be displayed on desktop/mobile/both
  description?: string; // the settings placed here represent the components inside the widget-settings-dialog.
  settings?: { [x: string]: SettingType<any> }; //
  picture?: string; // logo of the widget
  url?: string; // url of the widget project (e.g. github repository)
  author?: string; // author name / company name
  authorUrl?: string; // author / company url
  licence?: string; // licence of the widget
  labels?: string[]; // labels used to categorize the widget and better filter inside the marketplace
}

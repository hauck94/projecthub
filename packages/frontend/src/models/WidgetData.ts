// WIDGET DATA
// Contains all changeable data that should be persisted.
// All variables inside this interface are send to the backend
// and saved inside the database, every time a save action is triggered.
export interface WidgetData<T extends Object> {
  type: string; // the type is used to identify the widget type across the application
  i: string; // unique id of the the widget inside the widget-grid
  x: number; // x position on the widget-grid
  y: number; // y position on the widget-grid
  w: number; // width of the widget measured in grid columns
  h: number; // width of the widget measured in grid rows
  data: T; // custom widget data. This data can be further specified by the widget
}

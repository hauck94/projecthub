//import Widget from "../components/Widget";
import { WidgetData } from './WidgetData';

export interface Project {
  id: number;
  name: string;
  active: boolean;
  open: boolean;
  description?: string;
  labels?: string[];
  picture?: string;
  members: { id: number; username: string; picture: string; permission: string; status: string }[];
  widgets?: WidgetData<any>[];
}

import { Project } from "./Project";

export interface User {
    id: number;
    name: string;
    email: string;
    password: boolean;
    createdAt: string;
    updatedAt: string;
    projects: Project[];
   // widgets: Widget[];
  }

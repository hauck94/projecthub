import { Router } from 'express';
import { deleteWidgetById, createWidget, getWidgets, getWidgetById, updateWidgetById} from '../controller/widget.controller';

export const widgetRouter = Router({ mergeParams: true });

// GET All Widgets
widgetRouter.get('/', getWidgets);
// GET Widget by ID
widgetRouter.get('/:widgetId', getWidgetById);
// POST Create Widget
widgetRouter.post('/', createWidget);
// DELETE Widget by ID
widgetRouter.delete('/:widgetId', deleteWidgetById);
// UPDATE Widget by ID
widgetRouter.patch('/:widgetId', updateWidgetById);
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Widget } from '../entity/Widget';

export const getWidgets = async (_: Request, res: Response) => {
  const widgetRepository = getRepository(Widget);
  const widgets = await widgetRepository.find();
  res.send({
    data: widgets,
  });
};

export const getWidgetById = async (req: Request, res: Response) => {
  const widgetId = req.params.widgetId;
  const widgetRepository = getRepository(Widget);
  try {
    const widget = await widgetRepository.findOneOrFail(widgetId);
    res.send({
      data: widget,
    });
  } catch (e) {
    res.status(404).send({
      status: 'not_found',
    });
    res.send();
  }
};

export const createWidget = async (req: Request, res: Response) => {
  const { id, type, xPos, yPos, height, width, data } = req.body;

  const repo = getRepository(Widget);
  if (await repo.findOne({ id: id })) {
    res.status(400).send({
      status: 'ID already in use',
    });
  }
  const createdWidget = await repo.save(new Widget(id, type, xPos, yPos, height, width, data));

  res.send({
    data: createdWidget,
  });
};

export const deleteWidgetById = async (req: Request, res: Response) => {
  const widgetId = req.params.widgetId;
  const widgetRepository = getRepository(Widget);
  try {
    const widget = await widgetRepository.findOneOrFail(widgetId);
    await widgetRepository.remove(widget);
    res.status(204).send({
      status: 'Widget successfully deleted',
    });
  } catch (e) {
    res.status(404).send({
      status: 'not_found',
    });
    res.send();
  }
};

export const updateWidgetById = async (req: Request, res: Response) => {
  const widgetId = req.params.widgetId;
  const { xPos, yPos, height, width, data } = req.body;

  const widgetRepository = getRepository(Widget);
  try {
    let widget = await widgetRepository.findOneOrFail(widgetId);
    widget.xPos = xPos;
    widget.yPos = yPos;
    widget.height = height;
    widget.width = width;
    widget.data = data;

    widget = await widgetRepository.save(widget);

    res.status(204).send({
      data: widget,
    });
  } catch (e) {
    res.status(404).send({
      status: 'not_found',
    });
    res.send();
  }
};

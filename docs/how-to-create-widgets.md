# How to create a widget

This Guide walks you through all steps on how to create a Project-Hub widget. Widgets can be used to enhance or customize the user experience and improve your project-boards. The widget-library is build on top of the React framework. If you don't already know how to develop front-end components using React, please use one of the many great online resources like the the [official React Tutorial](https://reactjs.org/tutorial/tutorial.html).

## Requirements

Before you can start developing your widget, you first have to make sure these technologies are installed on your system.

- node.js 14 or higher
- Docker & docker-compose

Start the development server with the following command:

```
docker-compose up
```

Now you should be able to navigate to the local development instance using this URL: [http://localhost:3000](http://localhost:3000)

## Step 1 - Create the scaffolding

To create a new Widget you first have to add a new folder inside the following location `packages/frontend/src/widgets`. Name the folder like your widget. This folder is used to contain all resources relevant to your widget. A widget consists at least of the following **2** files that have to be created inside the newly added folder:

- `ExampleWidget.tsx` this is your react component that is displayed in the widget-grid
- `ExampleWidgetModel.ts` this file consists the necessary data and settings model that is used to display the settings dialog and persist changes

## Step 2 - Add content to the widget

To build the widget component start by creating a [React Functional Component](https://reactjs.org/docs/components-and-props.html). This function has to be of the type `Widget<ExampleWidgetData>` (see the implementation example below). Inside the function you have access to the `WidgetProps<ExampleWidgetData>` which exposes a `data` variable containing the current _WidgetData_ and a `setData` function for manipulating and saving this data. If you want to edit one of the following values inside your widget, you have to call the `saveData` function. This function automatically sends your data to the back-end.

_You can use the following example to start creating your own widget_

```Typescript
import { useState } from 'react';
import Widget from '../../components/Widget';
import { DefaultButton } from '../../components/DefaultButton';
import { ExampleWidgetData } from './ExampleWidgetModel';

const ExampleWidget: Widget<ExampleWidgetData> = ({ saveData, data: widgetData }) => {
  const [counter, setCounter] = useState<number>(widgetData.data?.counter ?? 0);

  return (
    <div
      style={{
        backgroundColor: widgetData.data.backgroundColor,
        width: '100%',
        height: '100%',
        display: 'grid',
        alignContent: 'center',
        justifyContent: 'center',
      }}
    >
      <h1>{widgetData.data.title}</h1>
      <DefaultButton
        value={counter}
        onClick={() => {
          setCounter(counter + 1);
          saveData({
            ...widgetData,
            data: {
              ...widgetData.data,
              counter: counter + 1,
            },
          });
        }}
      >
        {counter}
      </DefaultButton>
    </div>
  );
};

export default ExampleWidget;
```

## Step 3 - Add the widget model

Every widget consists of two models that have to be implemented.

#### WidgetInfo

```typescript
// WIDGET INFO
// Contains all static information about the widget.
// None of these information can be changed dynamically.
// This information is used by the application to correctly load and display the widget.
export interface WidgetInfo {
  name: string; // the type is used to identify the widget type across the application
  type: string; // The name attribute is used as the client-facing widget-name seen by the user
  size: { width: number; height: number }[]; // the size attribute represents the possible sizes the widget can be in
  displayMode: 'all' | 'desktop' | 'mobile'; // the displayMode is used to determine if the widget may be displayed on desktop/mobile/both
  description?: string; // the settings placed here represent the components inside the widget-settings-dialog.
  settings?: { [x: string]: SettingType<any> }; //
  url?: string; // url of the widget project (e.g. github repository)
  author?: string; // author name / company name
  authorUrl?: string; // author / company url
  licence?: string; // licence of the widget
  labels?: string[]; // labels used to categorize the widget and better filter inside the marketplace
}
```

#### WidgetData

```typescript
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
  data?: T; // custom widget data. This data can be further specified by the widget
}
```

The following code section shows an example implementation. _Note: The `ExampleWidgetData` doesn't extend or implement `WidgetData`. This is intentional, `ExampleWidgetData` just represents the generic data inside `WidgetData` and is later used by the `Widget` component (see Step 2)._

_You can use the following example to start creating the model_

```TypeScript
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
  description: '',
  url: '',
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
```

## Step 4 - Add the widget to the "AvailableWidgets" list

Add the widget to the general list so it can be detected by the application. To accomplish this, open the `AvailableWidgets.ts` file inside the `packages/frontend/src/widgets/` folder. There you just have to add a new entry to the JavaScript-object. The object consists of nested objects with two keys: `info` and `component`. Just provide the needed information and save your changes. Now the application should be able to detect your widget.

```TypeScript
import Widget from '../components/Widget';
import { WidgetProps } from '../components/Widget';
import { WidgetInfo } from '../models/WidgetInfo';
import OtherWidget from './Other/OtherWidget';
import ExampleWidget from './Example/ExampleWidget';
import { OtherWidgetInfo } from './Other/OtherWidgetModel';
import { ExampleWidgetInfo } from './Example/ExampleWidgetModel';

export const availableWidgets: {
  [key: string]: { info: WidgetInfo; component: Widget<any> };
} = {
  other: { info: OtherWidgetInfo, component: OtherWidget },
  example: { info: ExampleWidgetInfo, component: ExampleWidget }, // your widget
};

```

## Conclusion

If you followed all steps described above you should see a new button inside the `add widgets dialog`. If you select this button the Widget should be added to the page and be usable.

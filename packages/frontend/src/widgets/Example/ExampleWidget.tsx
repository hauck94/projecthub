import { useState } from 'react';
import Widget from '../../components/Widget';
import { DefaultButton } from '../../components/DefaultButton';
import { ExampleWidgetData } from './ExampleWidgetModel';

const ExampleWidget: Widget<ExampleWidgetData> = ({ saveData, data: widgetData }) => {
  const [counter, setCounter] = useState<number>(widgetData.data.counter ?? 0);

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

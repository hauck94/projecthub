import React from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { WidgetData } from '../models/WidgetData';
import './WidgetGrid.css';

interface WidgetGridProps {
  children?: JSX.Element[];
  widgets?: WidgetData<any>[];
  onLayoutChange?: (layout: GridLayout.Layout[]) => void;
  editable?: boolean;
  columns?: number;
  width?: number;
}

const WidgetGrid: React.FC<WidgetGridProps> = ({ children, widgets, onLayoutChange, editable, columns, width }) => {
  const tmpWidth = width ?? 1400;
  const tmpCols = columns ?? 8;
  const tmpRowHeight = tmpWidth / tmpCols - 10;

  return (
    <GridLayout
      className="layout"
      style={{ width: tmpWidth }}
      isDraggable={editable ?? false}
      isResizable={false}
      cols={tmpCols}
      rowHeight={tmpRowHeight}
      width={tmpWidth}
      layout={widgets}
      onLayoutChange={onLayoutChange}
    >
      {children?.map((entry, index) => (
        <div key={entry.key} style={{ cursor: editable ? 'move' : 'default' }}>
          {entry}
        </div>
      ))}
    </GridLayout>
  );
};

export default WidgetGrid;

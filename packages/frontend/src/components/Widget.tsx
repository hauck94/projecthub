import React, { PropsWithChildren, ReactElement } from 'react';
import styled from 'styled-components';
import { WidgetData } from '../models/WidgetData';
import { DefaultButton } from './DefaultButton';
import './WidgetGrid.css';

const EditWidgetOverlay = styled.div`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
`;

const ModifyContainer = styled.div`
  cursor: default;
  display: grid;
  grid-template-columns: auto auto;
  gap: 7px;
  background-color: #333;
  padding: 7px;
  border-radius: 7px;
  button {
    background-color: #eee;
    min-width: initial;
    &:focus {
      outline: none;
    }

    .delete-widget,
    .edit-widget {
      fill: rgb(54, 54, 54);
    }

    &:hover {
      background-color: white;
      .delete-widget {
        fill: rgb(255, 50, 50);
      }
      .edit-widget {
        fill: rgb(32, 172, 14);
      }
    }
  }
`;
export interface WidgetScaffoldingProps<D extends Object> {
  editable: boolean;
  data: WidgetData<D>;
  onDelete: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onEdit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: WidgetData<D>) => void;
}

export function WidgetScaffolding<D extends Object>(
  { children, editable, onDelete, onEdit, data }: PropsWithChildren<WidgetScaffoldingProps<D>>,
  context?: any,
): ReactElement<any, any> | null {
  return (
    <>
      {editable && (
        <EditWidgetOverlay>
          <ModifyContainer onMouseDown={(e) => e.stopPropagation()}>
            <DefaultButton onClick={(e) => onEdit(e, data)}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  className="edit-widget"
                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                />
              </svg>
            </DefaultButton>
            <DefaultButton onClick={onDelete}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  className="delete-widget"
                  d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                />
              </svg>
            </DefaultButton>
          </ModifyContainer>
        </EditWidgetOverlay>
      )}
      {children}
    </>
  );
}

export interface WidgetProps<D extends Object> {
  data: WidgetData<D>;
  saveData: (data: WidgetData<D>) => void;
}
type Widget<D> = (props: WidgetProps<D>) => ReactElement<any, any> | null;

export default Widget;

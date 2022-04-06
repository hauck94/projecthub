import Dialog from '../../components/Dialog';
import * as React from 'react';
import styled from 'styled-components';
import { Title } from '../../components/Title';

interface ImportWidgetDialogProps {
  show: boolean;
  onCancel?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const TopBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 5px 5px 5px 10px;
`;

const ImportWidgetDialog: React.FC<ImportWidgetDialogProps> = ({ show, onCancel }) => {
  return (
    <Dialog show={show} buttons={[{ text: 'cancel', onClick: onCancel }]}>
      <TopBar>
        <Title>Import new Widget</Title>
      </TopBar>
      <div>

      </div>
    </Dialog>
  );
};
export default ImportWidgetDialog;

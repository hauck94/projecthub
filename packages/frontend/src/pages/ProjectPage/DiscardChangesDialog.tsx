import Dialog from '../../components/Dialog';
import React, { useContext } from 'react';
import { WidgetData } from '../../models/WidgetData';
import styled, { ThemeContext } from 'styled-components';

interface AddWidgetDialogProps {
  show: boolean;
  onDiscard?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onCancel?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  widgets?: WidgetData<any>[];
}

const WarningText = styled.p`
  margin: 20px;
  font-weight: bold;
`;

const AddWidgetDialog: React.FC<AddWidgetDialogProps> = ({ show, onDiscard, onCancel }) => {
  const themeContext = useContext(ThemeContext);

  return (
    <Dialog
      show={show}
      buttons={[
        { text: 'yes', onClick: onDiscard, fontColor: 'white', color: themeContext.colors.danger },
        { text: 'cancel', onClick: onCancel },
      ]}
    >
      <WarningText>Do you want to discard the changes you made?</WarningText>
    </Dialog>
  );
};
export default AddWidgetDialog;

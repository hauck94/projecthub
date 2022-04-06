import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { DefaultButton } from './DefaultButton';
import Overlay from './Overlay';

interface DialogProps {
  show: boolean;
  buttons: {
    text: string;
    color?: string;
    fontColor?: string;
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  }[];
  onClose?: () => void;
}

const DialogContent = styled.div`
  overflow: hidden;
  background-color: ${(props) => props.theme.colors.bodyColor};
`;

const DialogBottomBar = styled.div`
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: ${(props) => props.theme.colors.bodyHighlightColor};
`;

const Dialog: React.FC<DialogProps> = ({ children, show, onClose, buttons }) => {
  const themeContext = useContext(ThemeContext);

  return (
    <Overlay style={{ display: 'grid', gridTemplateRows: 'max(100% - 56px) 56px' }} show={show} onClose={onClose}>
      <DialogContent>{children}</DialogContent>
      <DialogBottomBar>
        {buttons.map((entry, index) => (
          <DefaultButton
            key={index}
            onClick={entry.onClick}
            fontColor={entry.fontColor}
            disabled={entry.disabled}
            color={entry.color ?? themeContext.colors.contentDarkerColor}
          >
            {entry.text}
          </DefaultButton>
        ))}
      </DialogBottomBar>
    </Overlay>
  );
};

export default Dialog;

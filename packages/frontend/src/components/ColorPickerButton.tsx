import * as React from 'react';
import styled from 'styled-components';

const ColorPicker = styled.label`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  justify-content: left;
  gap: 5px;
  cursor: pointer;
  margin: 3px;
  padding-left: 10px;
  border-style: none;
  border-radius: 5px;
  height: 37px;
  width: 130px;
  font-size: 10pt;
  font-weight: 500;
  background-color: ${(props) => props.color ?? props.theme.colors.contentColor};
  overflow: hidden;
  &:hover {
    opacity: 0.8;
  }
`;
const ColorPickerInput = styled.input`
  position: absolute;
  transform: translate(-10px, 40px);
  visibility: hidden;
  width: 0px;
  height: 0px;
`;

const ColorPreview = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 5px;
`;

const SelectArrow = styled.span`
  margin-right: 7px;
`;

interface ColorPickerButtonProps {
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ColorPickerButton: React.FC<ColorPickerButtonProps> = ({ value, onChange }) => {
  return (
    <ColorPicker>
      <ColorPickerInput type="color" id="color-picker" value={value} onChange={onChange} />
      <ColorPreview className="result" style={{ backgroundColor: value }}></ColorPreview>
      <span>{value}</span>
      <SelectArrow>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
          <path fill="#aaa" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
        </svg>
      </SelectArrow>
    </ColorPicker>
  );
};

export default ColorPickerButton;

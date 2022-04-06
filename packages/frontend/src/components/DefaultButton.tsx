import { transparentize } from 'polished';
import styled from 'styled-components';

interface ButtonProps {
  color?: string;
  fontColor?: string;
}

export const DefaultButton = styled.button<ButtonProps>`
  cursor: pointer;
  margin: 3px;
  padding: 0px 15px;
  border-style: none;
  border-radius: 5px;
  height: 37px;
  min-width: 110px;
  font-size: 10pt;
  font-weight: 500;
  background-color: ${(props) => props.color ?? props.theme.colors.contentColor};
  color: ${(props) => props.fontColor ?? props.theme.colors.fontColor};
  overflow: hidden;
  &:hover {
    opacity: 0.8;
  }

  &:disabled,
  &[disabled],
  &:disabled:hover,
  &[disabled]:hover {
    opacity: 0.8;
    cursor: not-allowed;
    background-image: linear-gradient(
        45deg,
        ${(props) => props.color ?? props.theme.colors.primary} 25%,
        transparent 25%
      ),
      linear-gradient(-45deg, ${(props) => props.color ?? props.theme.colors.primary} 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, ${(props) => props.color ?? props.theme.colors.primary} 75%),
      linear-gradient(-45deg, transparent 75%, ${(props) => props.color ?? props.theme.colors.primary} 75%);
    background-size: 2px 2px;
    background-color: ${(props) =>
      props.color ? transparentize(0.7, props.color) : transparentize(0.7, props.theme.colors.primary)};
    background-position: 0 0, 1px 0, 1px -1px, 0px 1px;
  }
`;

import { darken } from 'polished';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const LinkButton = styled(Link)`
  cursor: pointer;
  text-decoration: none;
  margin: 3px;
  border-style: none;
  border-radius: 5px;
  height: 40px;
  min-width: 120px;
  font-size: 11pt;
  font-weight: 500;
  color: ${(props) => props.theme.colors.primary};

  white-space: normal;
  word-break: break-word;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    /* opacity: 0.8; */
    background-color: ${(props) => darken(0.05, props.theme.colors.bodyColor)};
  }
`;

import styled from 'styled-components';

export const DefaultInput = styled.input`
  margin: 3px;
  padding: 10px 17px;
  color: ${(props) => props.theme.colors.fontColor};
  background-color: ${(props) => props.theme.colors.contentColor};
  border-radius: 5px;
  border-style: none;
  font-size: 11pt;
  width: auto;
  outline-color: ${(props) => props.theme.colors.primary};

  &::focus {
    border-style: none;
  }
  &:hover {
    opacity: 0.8;
  }
`;

import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    * {
        box-sizing:border-box;
        margin: 0px;
        padding: 0px;
        user-select: none;
        font-family: Montserrat;
    }
    body, html {
        color:${(props) => props.theme.colors.fontColor};
        background-color: ${(props) => props.theme.colors.backgroundColor};
        margin: 0;
        width: 100%;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    code {
      font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
    }
`;

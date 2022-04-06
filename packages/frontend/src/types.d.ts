import {} from 'styled-components/cssprop';

// import original module declarations
import 'styled-components';
// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      backgroundColor: string;
      bodyColor: string;
      bodyHighlightColor: string;
      contentColor: string;
      contentDarkerColor: string;
      fontColor: string;
      primary: string;
      danger: string;
    };
  }
}

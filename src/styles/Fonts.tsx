import React from "react";
import { Global } from "@emotion/react";

const Fonts = () => (
    <Global
        styles={`
    @font-face {
        font-family: 'Nunito';
        font-weight: 400;
        src: url('../assets/fonts/Nunito/Nunito-Regular.ttf') format('truetype');
    }
    @font-face {
      font-family: 'Nunito';
      font-weight: 600;
      src: url('../assets/fonts/Nunito/Nunito-SemiBold.ttf') format('truetype');
    }
    @font-face {
      font-family: 'Nunito';
      font-weight: 700;
      src: url('../assets/fonts/Nunito/Nunito-Bold.ttf') format('truetype');
    }
    @font-face {
      font-family: 'Nunito';
      font-weight: 800;
      src: url('../assets/fonts/Nunito/Nunito-ExtraBold.ttf') format('truetype');
    }
 `}
    />
);

export default Fonts;

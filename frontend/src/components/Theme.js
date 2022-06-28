import { createTheme, ThemeProvider } from '@material-ui/core'
import { colors } from '@material-ui/core';

const white = '#FFFFFF';
const black = '#000000';

// A custom theme for this app
const theme = createTheme({
  palette: {

     primary: {
       main: '#294F66',
         dark:'#05353f',
         light:'#AED8E5'


     },
     secondary: {
       main: '#D23232',
     },

     success: {
         main: '#008A59'
     }


  },

    typography: {

      h1: {
      fontWeight: 600,
          fontSize: 41,
    },
        h2: {
          fontWeight: 500,
            fontSize: 26,
        },

    fontFamily: [
      "Avenir next",
        "sans serif"
    ].join(",")
  }


});


export default theme;
import { createTheme, ThemeProvider } from '@material-ui/core'
import { colors } from '@material-ui/core';

const white = '#FFFFFF';
const black = '#000000';

// A custom theme for this app
const theme = createTheme({
  palette: {

     primary: {
       main: '#315A65',
         dark:'#05353f',
         light:'#AED8E5'


     },
     secondary: {
       main: '#C498C0',
     },

     success: {
         main: '#facac0'
     }


  },
});


export default theme;
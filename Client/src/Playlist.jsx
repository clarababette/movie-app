import Search from "./Search";
import Favourites from "./Favourites";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function Playlist() {
  return (
     <ThemeProvider theme={darkTheme}>
      <div>
        <Favourites></Favourites>
      <Search></Search>
      </div>
     </ThemeProvider>
  )
}
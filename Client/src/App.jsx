import { useContext } from 'react'
import UserContext from './UserContext';
import SignUp from './SignUp';
import Login from './Login';
import { Typography } from '@mui/material'
import popcorn from './pop.svg';
import Playlist from './Playlist';

function App() {
  const { user, signup, loggedin } = useContext(UserContext);
  console.log(user)
  
  return (
    <div className="App" style={{ width: '80%', margin:'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding:'2rem' }}>
      <Typography variant='h4'>Film Favourites</Typography>
      {!loggedin && signup && <SignUp></SignUp>}
      {!loggedin && !signup && <Login></Login>}
      {loggedin && <Playlist></Playlist>}
      <img style={{width:'10rem', position:'absolute', right: '5rem', bottom:'3rem'}} src={popcorn}></img>
    </div>
  )
}

export default App

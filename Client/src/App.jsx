import { useState, useEffect } from 'react'
import SignUp from './SignUp';
import Login from './Login';
import { Typography } from '@mui/material'
import popcorn from './pop.svg';
import Playlist from './Playlist';
import axios from 'axios';

function App() {
  const [signup, setSignup] = useState(false);
  const [user, setUser] = useState();
  axios.defaults.headers.common['Authorization'] = user?.accessToken;
  axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:3023/api/';
  axios.defaults.withCredentials = true



  useEffect(() => {
    const getUser = async () => {
      await axios.post('http://localhost:3023/api/refresh').then(res => {
        setUser(res.data);
        axios.defaults.headers.common['Authorization'] = user.accessToken;
      }).catch(err => {console.log(err.message)})
    }
    if (!user) {
      getUser()
    }
  },[user])

  return (
    <div className="App" style={{ width: '80%', margin:'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding:'2rem' }}>
      <Typography variant='h4'>Film Favourites</Typography>
      {!user && signup && <SignUp user={setUser} signup={setSignup}></SignUp>}
      {!user && !signup && <Login signup={setSignup} user={setUser}></Login>}
      {user && <Playlist></Playlist>}
      <img style={{width:'10rem', position:'absolute', right: '5rem', bottom:'3rem'}} src={popcorn}></img>
    </div>
  )
}

export default App

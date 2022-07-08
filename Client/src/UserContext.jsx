import {createContext, useState, useEffect} from 'react';
import AxiosInstance from './AxiosInstance';

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const axios = AxiosInstance();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || undefined);
  const [signup, setSignup] = useState(false);
  const [favourites, setFavourites] = useState();
  const [loggedin, setLoggedin] = useState(false); 


  useEffect(() => { 
    const getPlaylist = async () => {
      await axios.get(`/api/playlist/${user.username}`).then(res => {
        if(Array.isArray(res.data)){
        const movies = res.data.map(movie => { return {...movie, favourite: true}})
        setFavourites(movies);}
        setLoggedin(true);
      }).catch(err => { console.log(err.message) })
    }
    console.log(user)
    if (user) {
      getPlaylist();
    } else if (!user) {
      setLoggedin(false)
    }

  },[user])
  
  
  return (
    <UserContext.Provider
      value={{
        user, setUser, signup, setSignup, favourites, setFavourites, loggedin, setLoggedin
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
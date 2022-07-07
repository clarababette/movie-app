import {createContext, useState, useEffect} from 'react';
import AxiosInstance from './AxiosInstance';

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const axios = AxiosInstance();
  const [user, setUser] = useState();
  const [signup, setSignup] = useState(false);
  const [favourites, setFavourites] = useState();


  useEffect(() => { 
    const getPlaylist = async () => {
      await axios.get(`/api/playlist/${user.username}`).then(res => {
        const movies = res.data.map(movie => { return {...movie, favourite: true}})
        setFavourites(movies);
      }).catch(err => { console.log(err.message) })
    }
    if (localStorage.getItem("user")) {
      console.log(localStorage.getItem("user"))
      setUser(JSON.parse(localStorage.getItem("user")));
    }
    if (user) {
      getPlaylist();
    }
  },[])
  
  
  return (
    <UserContext.Provider
      value={{
        user, setUser, signup, setSignup, favourites, setFavourites
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
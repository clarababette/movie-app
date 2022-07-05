import star from './star.svg';
import starGrey from './star-grey.svg';
import AxiosInstance from "./AxiosInstance";
import { useContext } from "react";
import UserContext from "./UserContext";

export default function StarBtn({ film }) {
   const axios = AxiosInstance();
  const { user, favourites, setFavourites } = useContext(UserContext)

  const handleToggle = async () => {
    if(!film.favourite) {
    await axios.post(`/api/playlist/${user.username}/add`, film).then(() => {
     const movies = [...favourites];
        movies[movies.findIndex(movie => movie.poster == film.poster)] = {...film, favourite: true}
       setFavourites([...movies])
    }).catch(err => console.log(err))
  } else {
      await axios.post(`/api/playlist/${user.username}/remove`, film).then(() => {
        const movies = [...favourites];
        movies[movies.findIndex(movie => movie.poster == film.poster)] = {...film, favourite: false}
       setFavourites([...movies])
      }).catch(err => console.log(err))
    }
    
  }

  return (
<img style={{position:'absolute', width:'2.5rem', top:'-1rem', left:'-1rem', zIndex:'100', transform:'rotate(-5deg)'}} onClick={handleToggle} src={film.favourite ? star : starGrey}></img>
  )
}
import { useState, useEffect, useContext } from 'react';
import { Card, TextField, IconButton, Typography } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AxiosInstance from './AxiosInstance';
import Film from './Film';
import UserContext from './UserContext';

export default function Search() {
  const { favourites } = useContext(UserContext);
  const axios = AxiosInstance();
  const [queryString, setQueryString] = useState('');
  const [queryResult, setQueryResult] = useState();
  const [resultMsg, setResultMsg] = useState();
  const [change, setChange] = useState(false);

  const findFavourites = (movies) => {
    movies.forEach((movie, index) => {
      favourites?.forEach(fav => {
        if (movie.poster == fav.poster && movie.title == fav.title) {
          movies[index] = {...fav}
        } 
     });
    });
   return movies
  }
  useEffect(() => {
    if (favourites && queryResult) {
      setQueryResult([...findFavourites(queryResult)])
      console.log('fave changed')
    }
  }, [favourites])
  
  useEffect(() => {
    if (change && favourites && queryResult) {
      setQueryResult([...findFavourites(queryResult)])
      setChange(false);
    }
  },[change])

  useEffect(() => {
    const trending = async () => {
      await axios.get('/api/trending').then(res => {
     console.log(res.data)
     setResultMsg('Trending films');
     setQueryResult([...findFavourites(res.data)])
     setChange(true);
    }).catch(err => console.log(err))
  }
  trending()
},[])

  
  const submitSearch = async () => {
    if (queryString) {
      setQueryResult();
      await axios.get(`/api/search?queryString=${queryString}`).then(res => {
        setResultMsg(`Search results for: "${queryString}"`)
        setQueryString('');
        setQueryResult(findFavourites(res.data))
      })}
  }

  return (
    <Card sx={{ padding: '1rem', width: '80vw', backgroundColor: '#2D4253', color:'whitesmoke' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h6'>Add to your favourites</Typography>
        <div>

          <TextField value={queryString} label="Search" onChange={(e) => setQueryString(e.target.value)} size='small' sx={{ input: { color: 'whitesmoke' } }}></TextField>
        <IconButton onClick={submitSearch}><SearchRoundedIcon></SearchRoundedIcon></IconButton>
        </div>
      </div>
      <Typography>{resultMsg}</Typography>
      <div style={{display:'flex', overflow:'scroll', width:'100%'}}>
      {queryResult && queryResult.map((film,index) => <Film key={film.favourite + index.toString()} film={film}></Film>)}
      </div>
    </Card>
  )
}
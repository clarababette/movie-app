import { useState, useContext, useEffect } from 'react';
import { Card, TextField, IconButton, Typography } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AxiosInstance from './AxiosInstance';
import Film from './Film';
import UserContext from './UserContext';

export default function Favourites() {
  const { favourites } = useContext(UserContext)
  const axios = AxiosInstance();
  const [queryString, setQueryString] = useState('');
  const [queryResult, setQueryResult] = useState();
  const [resultMsg, setResultMsg] = useState();


  const submitSearch = async () => {
    if (queryString) {
      setQueryResult();
    await axios.get(`/api/search?queryString=${queryString}`).then(res => {
      setQueryResult(res.data);
      setResultMsg(`Search results for: "${queryString}"`)
      setQueryString('');
    })}
  }

  return (
    <div style={{width:'90vw'}}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>

          <TextField value={queryString} label="Search" onChange={(e) => setQueryString(e.target.value)} size='small' sx={{ input: { color: 'whitesmoke' } }}></TextField>
        <IconButton onClick={submitSearch}><SearchRoundedIcon></SearchRoundedIcon></IconButton>
        </div>
      </div>
      <Typography>{resultMsg}</Typography>
      <div style={{display:'flex', overflow:'scroll', width:'100%'}}>
      {Array.isArray(favourites) && favourites.map((film,index) => <Film key={index} film={film}></Film>)}
      </div>
    </div>
  )
}
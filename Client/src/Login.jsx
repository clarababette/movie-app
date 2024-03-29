import { useState, useContext } from 'react';
import { Card, Typography, Button, TextField } from '@mui/material';
import React from 'react';
import AxiosInstance from './AxiosInstance';
import UserContext from './UserContext';

export default function Login() {
  const axios = AxiosInstance();
  const { setUser: user, setSignup: signup } = useContext(UserContext);
  const [details, setDetails] = useState({
    username:'',
    password:'',
  })
  const [errors, setErrors] = useState({
    username:undefined,
    password:undefined,
  })

  const handleSubmit = async () => {
    setErrors({
    username:undefined,
    password:undefined,
  })
    for (const field in details) {
      if (details[field] == '') {
        const error = {};
        error[field] = 'Field cannot be empty';
        setErrors({ ...errors, ...error })
      }
    }
     if (!Object.values(details).includes('')) {
       await axios.post('/api/login', { ...details })
         .then((res) => { if(res.data.username) {user(res.data); localStorage.setItem("user", JSON.stringify(res.data))}; })
         .catch((err) => console.log(err))
    }
  }


  return (
    <>
    <Card sx={{width:'20rem', margin:'1rem', padding:'1rem', display:'flex', flexDirection:'column', rowGap:'1.5rem'}}>
      <Typography variant='h6'>Login</Typography>
      <TextField error={errors.username ? true : false} helperText={errors.username} value={details.username} onChange={(e) => setDetails({...details, username: e.target.value})} label='Username'></TextField>
      <TextField error={errors.password ? true : false} helperText={errors.password} value={details.password} onChange={(e) => setDetails({...details, password: e.target.value})} label='Password' type='password'></TextField>
      <Button variant='contained' sx={{width:'fit-content'}} onClick={handleSubmit}>Login</Button>
      </Card>
      <Button onClick={() => signup(true)}>New here? Sign up for an account</Button>
      </>
  )
}
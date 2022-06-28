import axios from 'axios';
import { useState } from 'react';
import { Card, Typography, Button, TextField } from '@mui/material';
import React from 'react';

export default function Login({ signup, user }) {
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
       axios.post('http://localhost:3023/api/login', { ...details }).then((res) => { console.log(res); user(res.data)})
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
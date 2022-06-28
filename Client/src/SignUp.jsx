import axios from 'axios';
import { useState } from 'react';
import { Card, Typography, Button, TextField } from '@mui/material';
import React from 'react';

export default function SignUp({ user, signup}) {
  const [details, setDetails] = useState({
    firstName:'',
    lastName:'',
    username:'',
    password:'',
    confirmPassword:''
  })
  const [errors, setErrors] = useState({
    firstName:undefined,
    lastName:undefined,
    username:undefined,
    password:undefined,
    confirmPassword:undefined
  })

  const handleSubmit = async () => {
    setErrors({
    firstName:undefined,
    lastName:undefined,
    username:undefined,
    password:undefined,
    confirmPassword:undefined
  })
    for (const field in details) {
      if (details[field] == '') {
        const error = {};
        error[field] = 'Field cannot be empty';
        setErrors({ ...errors, ...error })
      }
    }
      if (details.password !== details.confirmPassword) {
      setErrors({...errors, password: 'Passwords must match', confirmPassword: 'Passwords must match'})
    } else if (!Object.values(details).includes('')) {
        axios.post('http://localhost:3023/api/signup', { ...details }).then((res) => { user(res.data);  signup(false)})
    }
  }


  return (
    <Card sx={{width:'20rem', margin:'1rem', padding:'1rem', display:'flex', flexDirection:'column', rowGap:'1.5rem'}}>
      <Typography variant='h6'>Sign Up</Typography>
      <TextField error={errors.firstName ? true : false} helperText={errors.firstName} value={details.firstName} onChange={(e) => setDetails({...details, firstName: e.target.value})} label='First name'></TextField>
      <TextField error={errors.lastName ? true : false} helperText={errors.lastName} value={details.lastName} onChange={(e) => setDetails({...details, lastName: e.target.value})} label='Last name'></TextField>
      <TextField error={errors.username ? true : false} helperText={errors.username} value={details.username} onChange={(e) => setDetails({...details, username: e.target.value})} label='Username'></TextField>
      <TextField error={errors.password ? true : false} helperText={errors.password} value={details.password} onChange={(e) => setDetails({...details, password: e.target.value})} label='Password' type='password'></TextField>
      <TextField error={errors.confirmPassword ? true : false} helperText={errors.confirmPassword} value={details.confirmPassword} onChange={(e) => setDetails({...details, confirmPassword: e.target.value})} label='Confirm password' type='password'></TextField>
      <Button variant='contained' sx={{width:'fit-content'}} onClick={handleSubmit}>Sign up</Button>
    </Card>
  )
}
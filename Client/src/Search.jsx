import { useState } from 'react';
import { Card, TextField, IconButton } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

export default function Search() {
  return (
    <Card  sx={{padding:'1rem'}}>
      <TextField size='small'></TextField>
      <IconButton><SearchRoundedIcon></SearchRoundedIcon></IconButton>
    </Card>
  )
}
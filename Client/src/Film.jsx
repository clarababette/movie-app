import { Card, Typography, Tooltip, Button } from '@mui/material';
import fallback from './fallback-poster.jpg';
import StarBtn from './StarBtn';
import AddBtn from './AddBtn';

export default function Film({ film }) {
  const { poster, title, year, favourite = 'unset' } = film;

  return (
    <Card sx={{ display: 'grid', margin: '1rem', padding: '1rem', rowGap:'0.25rem', minWidth: '8rem', justifyItems: 'center', overflow: 'visible', height: 'auto', position: 'relative', backgroundColor:'#76B1CA' }}>
      {favourite != 'unset' && <StarBtn film={film}></StarBtn>}
      <Tooltip title={title}>
      <Typography sx={{whiteSpace:'nowrap', cursor:'default', overflow:'hidden', textOverflow:'ellipsis', width:'7rem', textAlign:'center' }} variant='subtitle1'>{title}</Typography>
      </Tooltip>
      <img style={{width:'5rem'}} src={!poster.includes('null') ? poster : fallback}></img>
      <Typography variant='subtitle2' >{year}</Typography>
      {favourite == 'unset' && <AddBtn film={film}></AddBtn>}
    </Card>
  )
}
import { Button } from "@mui/material";
import AxiosInstance from "./AxiosInstance";
import { useContext } from "react";
import UserContext from "./UserContext";

export default function AddBtn({ film }) {
  const axios = AxiosInstance();
  const { user, favourites, setFavourites } = useContext(UserContext)

  const handleAdd = async () => {
    await axios.post(`/api/playlist/${user.username}/add`, film).then(() => {
     setFavourites([...favourites, {...film, favourite: true}])
   }).catch(err => console.log(err))
  }

  return (
    <Button size="small" variant="contained" onClick={handleAdd} sx={{fontSize:'0.65rem'}}>Add to favourites</Button>
  )
} 
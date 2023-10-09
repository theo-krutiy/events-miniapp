"use client"

import { useContext } from 'react'
import { Grid, Box, Card, TextField, Stack, Typography, CardActions } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CardActionArea from '@mui/material/CardActionArea';

import { CategoriesContext } from '@/contexts/CategoriesContext';


export default function SearchBar({
  category,
  setCategory,
  setSearchQuery,
  setFilterIsOpen,
})
{
  const categories = useContext(CategoriesContext)
  const borderWidth = 0
  return (
    <Card
      variant="outlined"
      sx={{borderRadius: 3}}
    > 
    <Grid
      container
      sx={{
        padding: 0,
        border:borderWidth,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Grid item xs={1} sx={{
        border: borderWidth,
        // height: "100%"
        }}>
        <SearchIcon sx={{ml: 1, pt: 0.5}}/>
      </Grid>
      <Grid item xs={10} sx={{border:borderWidth}}>
        <Input
            fullWidth
            disableUnderline
            variant="outlined"
            size="small"
            placeholder="Search events"
            onChange={(e) => {
              setSearchQuery(e.target.value)
            }}
            sx={{pt:0.5}}
          />
      </Grid>
      <Grid item xs={1} sx={{border:borderWidth}}>
        <IconButton
            onClick={()=>{setFilterIsOpen(true)}}
            size="small"
        >
          <TuneIcon />
        </IconButton>
      </Grid>
      <Grid item xs={12} sx={{border:borderWidth}}>
        <Divider></Divider>
      </Grid>
      <Grid item xs={3} sx={{border:borderWidth}}>
        <Chip
          clickable
          onClick={()=>{setCategory(null)}}
          label={
            category ? category : "Choose category"
          }
          icon={categories[category]}
          sx={{my:0.5}}
        />
      </Grid>
      <Grid item xs={9} sx={{
        border:borderWidth,
        }}>
      <Stack 
      direction="row"
      spacing={1}
      >
        <Typography sx={{
          py: 1,
        }}>In: </Typography>
        <CardActionArea>
        <Typography>Tbilisi, Georgia</Typography>
        </CardActionArea>
      </Stack>
      </Grid>
    </Grid>
    </Card>
  )
}
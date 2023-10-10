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
  eventLocation
})
{
  const categories = useContext(CategoriesContext)
  return (
    <Grid
      container
      sx={{
        alignItems: "center",
        justifyContent: "center",
        py: 1,
        rowGap: 1
      }}
    > 
    <Grid item container xs={12} sx={{
      border: 1,
      borderColor: "text.disabled",
      borderRadius: 3,
      alignItems: "center",
      px: .5,
      py: .5
    }}
    >
      <Grid item xs={1}>
        <SearchIcon/>
      </Grid>
      <Grid item xs={7}>
        <Input
          fullWidth
          disableUnderline
          size="small"
          placeholder="Search events"
          onChange={(e) => {
            setSearchQuery(e.target.value)
          }}
        />
      </Grid>
      <Grid item container xs={4} justifyContent="flex-end">
        <Grid item>
          <IconButton
              onClick={()=>{setFilterIsOpen(true)}}
              size="big"
              color="primary"
              sx={{
                border: 1
              }}
          >
          <TuneIcon />
          </IconButton>
        </Grid>
      </Grid>
          
    </Grid>
    <Grid item container  xs={12} >
      <Stack 
        direction="row"
        spacing={.5}
        alignItems="center"
        >
        <Chip
          clickable
          color="secondary"
          onClick={()=>{setCategory(null)}}
          label={
            category ? category : "Choose category"
          }
          icon={categories[category]}
        />
        <Typography sx={{pl: .5}}>in</Typography>
        <Typography>{eventLocation}</Typography>
      </Stack>
    </Grid>
  </Grid>
  )
}
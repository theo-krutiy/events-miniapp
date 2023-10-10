"use client"

import { useState, useContext } from 'react'
import { Grid, Card, Typography, CardActionArea, CardContent, Divider, Dialog, Button } from '@mui/material';
import { formatEventTime } from './utils';
import EventCardExpanded from './EventCardExpanded.js';
import PeopleIcon from '@mui/icons-material/People';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import Chip from '@mui/material/Chip'
import { CategoriesContext } from '@/contexts/CategoriesContext';


export default function EventCard( { event } ){
  const [isExpanded, setIsExpanded] = useState(false)
  const categories = useContext(CategoriesContext)
  const borderWidth = 0
  return (
    <>
      <Card
        variant="outlined"
        sx={{ bgcolor: "primary.default"}}
        >
        <CardActionArea onClick={()=>{setIsExpanded(true)}}>
          <CardContent sx={{
            padding: 1
          }}
          
          >
            <Grid 
              container
              sx={{
                justifyContent: "flex-start",
                alignContent: "stretch",
              }}
            >
              <Grid item xs={6} sx={{border:borderWidth}}>
                <Typography>{event.event_name}</Typography>
              </Grid>
              <Grid item container xs={6} sx={{
                justifyContent: "flex-end",
              }}>
              <Chip 
                label={event.category}
                icon={categories[event.category]}
                sx={{
                  fontSize: 10
                }}
              />
              </Grid>
              <Grid item container xs={5} sx={{
                alignItems: "center"
              }}>
                <AccessTimeOutlinedIcon />
                <Typography variant="h8" suppressHydrationWarning>{formatEventTime(event.event_time)}</Typography>
              </Grid>
              <Grid item container xs={5} sx={{
                alignItems: "center"
              }}>
                <PlaceOutlinedIcon />
                <Typography variant="h8">{event.event_location}</Typography>
              </Grid>
              <Grid item container xs={2} sx={{
                  alignItems: "center",
                }}>
                <PeopleIcon />
                <Typography variant="h8">{event.curr_participants}/{event.max_participants}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </CardActionArea>
      </Card>
      <Dialog
        open={isExpanded}
        fullScreen
      > 
        <EventCardExpanded  event={event} closeSelf={()=>{setIsExpanded(false)}} />        
      </Dialog>
    </>
  )
  
}


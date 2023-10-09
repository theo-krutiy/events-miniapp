"use client"

import { useState } from 'react'
import { Grid, Card, Typography, CardActionArea, CardContent, Divider, Dialog, Button } from '@mui/material';
import { formatEventTime } from './utils';
import EventCardExpanded from './EventCardExpanded.js';

export default function EventCard( { event } ){
  const [isExpanded, setIsExpanded] = useState(false)
  const borderWidth = 0
  return (
    <>
      <Card
        sx={{
          border: 0.5
        }}
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
                border:borderWidth
              }}
            >
              <Grid item xs={6} sx={{border:borderWidth}}>
                <Typography>{event.event_name}</Typography>
              </Grid>
              <Grid item xs={4} sx={{border:borderWidth}}>
                <Typography variant="h8">Joined: {event.curr_participants}/{event.max_participants}</Typography>
              </Grid>
              <Grid item xs={6} sx={{border:borderWidth}}>
                <Typography variant="h8" suppressHydrationWarning>When: {formatEventTime(event.event_time)}</Typography>
              </Grid>
              <Grid item xs={6} sx={{border:borderWidth}}>
                <Typography variant="h8">Where: {event.event_location}</Typography>
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


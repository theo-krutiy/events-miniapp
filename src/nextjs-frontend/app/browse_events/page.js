"use client"

import { useState, useContext, useEffect } from 'react'
import { Typography } from '@mui/material'
import { CategoriesContext } from '@/contexts/CategoriesContext';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SearchBar from './SearchBar';
import { UserContext } from '@/contexts/UserContext';
import { getEvents } from "@/server_actions/actions.js";
import EventList from '@/components/EventList';
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { TelegramContext } from '@/contexts/TelegramContext';
import { useRouter } from 'next/navigation'


export default function Page(){
  const router = useRouter()
  const WebApp = useContext(TelegramContext)
  WebApp.BackButton.show()
  WebApp.BackButton.onClick(() => router.push('/'))
  
  const categories = useContext(CategoriesContext)
  
  const user = useContext(UserContext)
  const [filterIsOpen, setFilterIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [eventLocation, setEventLocation] = useState("Tbilisi")
  const [showJoinedEvents, setShowJoinedEvents] = useState(false)
  const [showPastEvents, setShowPastEvents] = useState(false)
  const [showFullEvents, setShowFullEvents] = useState(false)
 
  const [category, setCategory] = useState(null)
  const [sortingOptionIdx, setSortingOptionIdx] = useState(0)
  const SortingOptions = [
    ["", false],
    ["event_time", true],
    ["event_time", false],
    ["max_participants", false],
    ["max_participants", true],
  ]

  const [events, setEvents] = useState(null)

  
  useEffect(() => {
    async function startFetching() {
      const queryParams = {
        category: category == "All events" ? "all": category,
        search_query: searchQuery,
        order_by: SortingOptions[sortingOptionIdx][0],
        user_id: user.user_id,
        show_joined_events: showJoinedEvents,
        show_past_events: showPastEvents,
        descending: SortingOptions[sortingOptionIdx][1],
        event_location: eventLocation,
        show_joined_events: showJoinedEvents,
        show_past_events: showPastEvents,
        show_full_events: showFullEvents,
      }
      setEvents(null)
      let result = await getEvents(JSON.stringify(queryParams))
      if (!ignore) {
        setEvents(result)
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    }
  }, 
    [
      category, sortingOptionIdx, searchQuery, 
      showJoinedEvents, showFullEvents, showPastEvents, 
      user, eventLocation
    ]
  )


  return (
    <>
      <SearchBar 
        category={category}
        setCategory={setCategory}
        setSearchQuery={setSearchQuery} 
        setFilterIsOpen={setFilterIsOpen}
        eventLocation={eventLocation}
      />
      <Box
        height="84.5vh"
      >
        {
          category ? <SearchResults events={events} />
          : <IconsGrid 
              categories={categories}
              setCategory={setCategory}
            />       
        }
        <Filter 
          isOpen={filterIsOpen} 
          setIsOpen={setFilterIsOpen}
          sortingOptionIdx={sortingOptionIdx}
          setSortingOptionIdx={setSortingOptionIdx}
          showPastEvents={showPastEvents}
          showFullEvents={showFullEvents}
          showJoinedEvents={showJoinedEvents}
          setShowPastEvents={setShowPastEvents}
          setShowFullEvents={setShowFullEvents}
          setShowJoinedEvents={setShowJoinedEvents}
          eventLocation={eventLocation}
          setEventLocation={setEventLocation}
        />
      </Box>
    </>
  )
}


function IconsGrid({categories, setCategory}){
  return (
    <Grid 
      container
      justifyContent="space-evenly"
      alignContent="space-around"
      sx={{
        height: "87%",
        columnGap: 1
      }}
    >
    <Grid item xs = {10}>
      <Button 
        fullWidth
        variant="outlined"
        size="small"
        sx={{
          borderRadius: 6,
          padding: 2,
          fontSize: 12
        }}
        onClick={()=>setCategory("All events")}
      >
      All events
      </Button>
    </Grid>
      {
        Object.entries(categories).map((entry) => 
          <Grid item container key={entry} xs={5}>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                borderRadius: 6,
                py: 2,
                px: 1,
              }}
              key={entry[0]}
              onClick={() => setCategory(entry[0])}
            >
            <Stack
              container
              direction="row"
              justifyContent="center"
              sx={{
                fontSize: 11,
                columnGap: 1
              }}
            >
            {entry[1]}
            {entry[0]}
            </Stack>  
              
            </Button>
          </Grid>
        )
      }
    </Grid>
  )
}


function SearchResults({ events }){
  return(
    <>
      {
        events ? 
        (
          events.length !== 0 ?
          <EventList events={events}/>
          : "¯\\_(ツ)_/¯ No events found"
        )
        : "Loading..."
      }
    </>
  )
}


function Filter({ 
  isOpen, setIsOpen, sortingOptionIdx, setSortingOptionIdx,
  showJoinedEvents, setShowJoinedEvents, showFullEvents, 
  setShowFullEvents, showPastEvents, setShowPastEvents,
  eventLocation, setEventLocation
}){
  return(
    <SwipeableDrawer
      open={isOpen}
      anchor="bottom"  
      disableBackdropTransition  
      onClose={()=>setIsOpen(false)}
    >
    <Grid 
      container
      justifyContent="flex-start"
      alignContent="space-between"
      sx={{
        height: "90.5vh",
        p: 3,
      }}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Filter</Typography>
      </Grid>
      <Grid item container xs={5} justifyContent="flex-start">
        <Button 
          variant="contained"
          onClick={()=>{
            setSortingOptionIdx(0)
          }}
          sx={{fontSize: 10}}
        >
          Clear filters
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
          <TextField 
            variant="standard"
            label="Enter city name"
            value={eventLocation}
            onChange={e => setEventLocation(e.target.value)}
          />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={8}>
        <Stack
          sx={{
            rowGap: 1
          }}
        >
          <Typography>Sort by:</Typography>
          <Chip 
            clickable
            label={"Time (upcoming first)"}
            color="primary"
            variant={sortingOptionIdx==1 ? "filled": "outlined"}
            onClick={()=>{
              setSortingOptionIdx(1)
            }}
          />
          <Chip 
            clickable
            label={"Time (upcoming last"}
            color="primary"
            variant={sortingOptionIdx==2 ? "filled": "outlined"}
            onClick={()=>{
              setSortingOptionIdx(2)
            }}
          />
          <Chip 
            clickable
            label={"Event size (small events first)"}
            color="primary"
            variant={sortingOptionIdx==3 ? "filled": "outlined"}
            onClick={()=>{
              setSortingOptionIdx(3)
            }}
          />
          <Chip 
            clickable
            label={"Event size (big events first)"}
            color="primary"
            variant={sortingOptionIdx==4 ? "filled": "outlined"}
            onClick={()=>{
              setSortingOptionIdx(4)
            }}
          />
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item container xs={12}>
        <Stack direction="row" alignItems="center">
          <Checkbox 
            checked={showPastEvents}
            onChange={()=>{setShowPastEvents(!showPastEvents)}}
          /><Typography>Show past events</Typography>
        </Stack>
        <Stack direction="row" alignItems="center">
          <Checkbox 
            checked={showFullEvents}
            onChange={()=>{setShowFullEvents(!showFullEvents)}}
          /><Typography>Show full events</Typography>
        </Stack>
        <Stack direction="row" alignItems="center">
          <Checkbox 
            checked={showJoinedEvents}
            onChange={()=>{setShowJoinedEvents(!showJoinedEvents)}}
          /><Typography>Show events you joined</Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Button 
          fullWidth
          onClick={()=>{setIsOpen(false)}}
        >Apply</Button>
      </Grid>
    </Grid>
    </SwipeableDrawer>
  )
}
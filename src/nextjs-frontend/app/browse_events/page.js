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
import Drawer from '@mui/material/Drawer'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box';
import { TelegramContext } from '@/contexts/TelegramContext';


export default function Page(){
  const categories = useContext(CategoriesContext)
  
  const user = useContext(UserContext)
  const [filterIsOpen, setFilterIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [eventLocation, setEventLocation] = useState("")
  const [showJoinedEvents, setShowJoinedEvents] = useState(false)
  const [showCreatedEvents, setShowCreatedEvents] = useState(false)
  const [showPastEvents, setShowPastEvents] = useState(false)
 
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
        category: category,
        search_query: searchQuery,
        order_by: SortingOptions[sortingOptionIdx][0],
        user_id: user.user_id,
        show_joined_events: showJoinedEvents,
        show_created_events: showCreatedEvents,
        show_past_events: showPastEvents,
        descending: SortingOptions[sortingOptionIdx][1],
        event_location: eventLocation
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
  }, [category, sortingOptionIdx, searchQuery, showJoinedEvents, showCreatedEvents, user, eventLocation])


  return (
    <>
      <Box
        // border={1}
        height="97vh"
      >
        
      
      <SearchBar 
        category={category}
        setCategory={setCategory}
        setSearchQuery={setSearchQuery} 
        setFilterIsOpen={setFilterIsOpen}
        // sx={{
        //   height: "13%",
        //   borderRadius: 3
        // }}
      />

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
        py: 2,
        px: 1
      }}
    >
      {
        Object.entries(categories).map((entry) => 
          <Grid item key={entry} xs={5}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              sx={{
                borderRadius: 6,
                padding: 2
              }}
              key={entry[0]}
              onClick={() => setCategory(entry[0])}
            >
            <Stack
              container
              direction="row"
              spacing={1}
            >
              {entry[1]}
              <Typography variant="button">{entry[0]}</Typography>
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

function Filter({ isOpen, setIsOpen, sortingOptionIdx, setSortingOptionIdx }){
  return(
    <Drawer
      open={isOpen}
      anchor="bottom"    
      onClose={()=>setIsOpen(false)}
    >
    <Grid 
      container
      alignContent={"flex-start"}
      spacing={2}
      padding={3}
      sx={{
        height: "88vh"
      }}
    >
    <Grid item xs={12} ><Typography variant="h5">Filter</Typography></Grid>
    <Grid item xs={4}>
      <Button 
        fullWidth
        onClick={()=>{
          setSortingOptionIdx(0)
        }}
      >Clear filters</Button>
    </Grid>
    <Grid item xs={12}><Typography>Sort by:</Typography></Grid>
    <Grid item xs={6}>
      <Chip 
        clickable
        label={"Time (upcoming first)"}
        variant={sortingOptionIdx==1 ? "filled": "outlined"}
        onClick={()=>{
          setSortingOptionIdx(1)
        }}
      >
      </Chip>
    </Grid>
    <Grid item xs={12}>
      <Chip 
        clickable
        label={"Time (upcoming last"}
        variant={sortingOptionIdx==2 ? "filled": "outlined"}
        onClick={()=>{
          setSortingOptionIdx(2)
        }}
      ></Chip>
    </Grid>
    <Grid item xs={12}>
      <Chip 
        clickable
        label={"Maximum number of participants (small events first)"}
        variant={sortingOptionIdx==3 ? "filled": "outlined"}
        onClick={()=>{
          setSortingOptionIdx(3)
        }}
      ></Chip>
    </Grid>
    <Grid item xs={12}>
      <Chip 
        clickable
        label={"Maximum number of participants (big events first"}
        variant={sortingOptionIdx==4 ? "filled": "outlined"}
        onClick={()=>{
          setSortingOptionIdx(4)
        }}
      ></Chip>
    </Grid>
    <Grid item xs={12}>
      <Button 
        fullWidth
        onClick={()=>{setIsOpen(false)}}
      >Apply</Button>
    </Grid>
    </Grid>
    </Drawer>
  )
}
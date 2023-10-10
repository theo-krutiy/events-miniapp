import { Stack } from '@mui/material'
import EventCard from './EventCard'
import Divider from '@mui/material/Divider';


export default function EventList({ events }){
  return (
    <Stack
      sx={{
        rowGap: .5,
      }}
    >
      {events.map((event) => 
        <EventCard key={event.event_id} event={event}/>
        )
      }
    </Stack>
  )
} 
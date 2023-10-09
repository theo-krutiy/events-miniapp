import { List } from '@mui/material'
import EventCard from './EventCard'
import Divider from '@mui/material/Divider';


export default function EventList({ events }){
  return (
    <List
      dense
    >
      {events.map((event) => 
        <EventCard key={event.event_id} event={event}/>
        )}
    </List>
  )
} 
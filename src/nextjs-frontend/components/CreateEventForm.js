"use client"

import { useState, useContext } from 'react';
import { Stack, TextField, MenuItem, Button } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { UserContext } from '@/contexts/UserContext';
import { CategoriesContext } from '@/contexts/CategoriesContext';


const error_code_mapping = {
  "event_name_not_unique": "Event with this name already exists!",
}


export default function CreateEventForm({ setNewEventName, formAction, error_code }) {
  const [eventName, setEventName] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventTime, setEventTime] = useState(dayjs().add(1, 'hour').startOf('hour'));
  const [maxParticipants, setMaxParticipants] = useState(1);
  const [eventDescription, setEventDescription] = useState('');
  const user = useContext(UserContext);
  const categories = useContext(CategoriesContext)
  
  return (
    <form action={() => {
      const values = {
        event_name: eventName,
        category: eventCategory,
        event_location: eventLocation,
        event_time: eventTime,
        max_participants: maxParticipants,
        description: eventDescription,
        owner_id: user.user_id
      }
      formAction(JSON.stringify(values))
      }}>
      <Stack
        spacing={2}
      > 
        <TextField
          required
          fullWidth
          id="event_name"
          name="event_name"
          label="Event name"
          inputProps={{
            maxLength: 256
          }}
          onChange={(e) => {
          setEventName(e.target.value)
          setNewEventName(e.target.value)
          }}
          value={eventName}
          autoFocus 
          error={error_code == "event_name_not_unique"}
          helperText={
            error_code !== null 
            && error_code_mapping[error_code]}
        />
        <TextField
            required
            id="select-category"
            name="category"
            select
            label="Choose event category"
            onChange={e => setEventCategory(e.target.value)}
            value={eventCategory}
          >
            {Object.keys(categories).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
        </TextField>
        <TextField
          required
          id="event_location"
          name="event_location"
          label="Where will your event happen"
          onChange={e => setEventLocation(e.target.value)}
          value={eventLocation}
        >
        </TextField>
        <MobileDateTimePicker 
          label="When will your event happen?"
          disablePast
          ampm={false}
          name="event_time"
          onChange={(e) => setEventTime(e)}
          value={eventTime}
        />
        <TextField
          id="max_participants"
          name="max_participants"
          label="Maximum number of participants"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={e => setMaxParticipants(e.target.value)}
          value={maxParticipants}
        />
        <TextField 
          fullWidth
          id="description"
          name="description"
          label="Describe your event"
          multiline
          inputProps={{
            maxLength: 1024
          }}
          onChange={e => setEventDescription(e.target.value)}
          value={eventDescription }
        />
        <Button 
          fullWidth
          size='large'
          type="submit"
        >Create event</Button>        
      </Stack>
    </form>
  )

}
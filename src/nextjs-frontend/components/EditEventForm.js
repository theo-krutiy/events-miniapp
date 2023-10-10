"use client"

import { useState, useContext } from 'react';
import { Stack, TextField, MenuItem, Button } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { CategoriesContext } from '@/contexts/CategoriesContext';

const error_code_mapping = {
  "event_name_not_unique": "Event with this name already exists!",
}

export default function EditEventForm({ eventID, eventInfo, setTempEventInfo, formAction, error_code }) {
  const [eventName, setEventName] = useState(eventInfo.event_name);
  const [eventCategory, setEventCategory] = useState(eventInfo.category);
  const [eventLocation, setEventLocation] = useState(eventInfo.event_location);
  const [eventTime, setEventTime] = useState(dayjs(eventInfo.event_time));
  const [maxParticipants, setMaxParticipants] = useState(eventInfo.max_participants);
  const [eventDescription, setEventDescription] = useState(eventInfo.description);
  const categories = useContext(CategoriesContext)

  
  return (
    <form action={() => {
      const values = {
        event_id: eventID,
        event_name: eventName,
        event_location: eventLocation,
        category: eventCategory,
        event_time: eventTime,
        max_participants: maxParticipants,
        description: eventDescription,
      }
      formAction(JSON.stringify(values))
      setTempEventInfo(values)
      }}>
      <Stack
        spacing={2}
      > 
        <TextField
          fullWidth
          id="event_name"
          name="event_name"
          label="Change event name"
          inputProps={{
            maxLength: 256
          }}
          onChange={(e) => {
          setEventName(e.target.value)
          }}
          value={eventName}
          autoFocus 
          error={error_code == "event_name_not_unique"}
          helperText={
            error_code !== null 
            && error_code_mapping[error_code]}
        />
        <TextField
            id="select-category"
            name="category"
            select
            label="Change event category"
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
          label="Change event location"
          onChange={e => setEventLocation(e.target.value)}
          value={eventLocation}
        >
        </TextField>
        <MobileDateTimePicker 
          label="Change event time"
          ampm={false}
          name="event_time"
          onChange={(e) => setEventTime(e)}
          value={eventTime}
          sx={{zIndex: 'tooltip'}}
        />
        <TextField
          id="max_participants"
          name="max_participants"
          label="Change maximum number of participants"
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
          value={eventDescription}
        />
        <Button 
          fullWidth
          size='large'
          type="submit"
        >Apply</Button>        
      </Stack>
    </form>
  )

}
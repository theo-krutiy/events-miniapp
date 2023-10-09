"use client"


import { Stack, Dialog, Typography, Button } from '@mui/material';
import CreateEventForm from "@/components/CreateEventForm";
import { experimental_useFormState as useFormState } from 'react-dom'
import { createEvent } from '@/server_actions/actions.js';

export default function Page(){
  const initialState = {
    error_code: null, 
    event_created: false
  }
  const [state, formAction] = useFormState(createEvent, initialState)
  return (
    <>
      <h1>Create your event</h1>
      <CreateEventForm formAction={formAction} error_code={state.error_code}/>
      <Dialog 
        open={state.event_created}
        fullScreen
        
      >
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{
            mt: 25,
            }}
        >
          <Typography 
            variant="h4"
            sx={{
              p: 2
            }}
          >
          Event created</Typography>
          <Button href="/" fullWidth>Home</Button>
        </Stack>
      </Dialog>
    </>
  )
}


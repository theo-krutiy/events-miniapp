"use client"


import { Stack, Dialog, Typography, Button } from '@mui/material';
import CreateEventForm from "@/components/CreateEventForm";
import { experimental_useFormState as useFormState } from 'react-dom'
import { createEvent } from '@/server_actions/actions.js';
import { useState, useContext} from 'react'
import { TelegramContext } from '@/contexts/TelegramContext';
import { useRouter } from 'next/navigation'


export default function Page(){
  const router = useRouter()
  const WebApp = useContext(TelegramContext)
  WebApp.BackButton.show()
  WebApp.BackButton.onClick(() => router.push('/'))

  const initialState = {
    error_code: null, 
    event_created: false
  }
  const [newEventName, setNewEventName] = useState("")
  const [state, formAction] = useFormState(createEvent, initialState)
 
  return (
    <>
      <h1>Create your event</h1>
      <CreateEventForm formAction={formAction} setNewEventName={setNewEventName} error_code={state.error_code}/>
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
          {newEventName} created successfully!
          </Typography>
          
          <Button href="/" fullWidth>Home</Button>
        </Stack>
      </Dialog>
    </>
  )
}


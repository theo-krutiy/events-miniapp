"use client"


import { useContext, useState } from 'react';
import { Stack, Typography, Button, IconButton } from "@mui/material"
import { formatEventTime } from "./utils";
import { UserContext } from '@/contexts/UserContext';
import { addUserToEvent, deleteUserFromEvent, editEvent, deleteEvent } from '@/server_actions/actions';
import Grid from '@mui/material/Grid'
import { CategoriesContext } from '@/contexts/CategoriesContext';
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Drawer from '@mui/material/Drawer'
import EditEventForm from './EditEventForm';
import { experimental_useFormState as useFormState } from 'react-dom'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'


export default function EventCardExpanded({ event }){
  const categories = useContext(CategoriesContext)
  
  const user = useContext(UserContext)

  let S = new Set(user.eventsJoined.map((e)=>e.event_id))
  const [userJoined, setUserJoined] = useState(S.has(event.event_id));

  S = new Set(user.eventsCreated.map((e)=>e.event_id))
  const userOwns = S.has(event.event_id)
  const [isEditing, setIsEditing] = useState(false)
  const [eventEditedSuccessfully, setEventEditedSuccessfully] = useState(false)
  const [userJoinedSuccessfully, setUserJoinedSuccessfully] = useState(false)
  const [userLeftSuccessfully, setUserLeftSuccessfully] = useState(false)
  const [editingState, formAction] = useFormState(
    editEvent, 
    {
      error_code: null,
      event_edited: false
    }
  )
  const [eventInfo, setEventInfo] = useState(
    {
      event_name: event.event_name,
      description: event.description,
      event_time: event.event_time,
      event_location: event.event_location,
      category: event.category,
      max_participants: event.max_participants,
    }
  )
  const [tempEventInfo, setTempEventInfo] = useState(eventInfo)
 
 
  return (
    <>
    {
      eventEditedSuccessfully 
      && <Alert severity="success" onClose={()=>{setEventEditedSuccessfully(false)}}>
      Changes applied successfully
      </Alert>
    }
    {
      userJoinedSuccessfully
      && <Alert severity="success" onClose={()=>{setUserJoinedSuccessfully(false)}}>
      You have joined this event
      </Alert>
    }
    {
      userLeftSuccessfully 
      && <Alert severity="success" onClose={()=>{setUserLeftSuccessfully(false)}}>
      You have left this event
      </Alert>
    }
    <Grid 
        container 
        padding={3}
        alignContent="flex-start"
        sx={{
          height: "100%"
        }}
      >
      <Grid
        item container
        xs={12}
      >
        {/* <Grid
          item container
          xs={3}
        >
          <Grid 
            item 
            xs={12}
            sx={{
            }}
          >
            <Avatar
              sx={{
                width: "12vh",
                height: "12vh",
                ml: 3
              }}
            >ME</Avatar>
          </Grid>
          <Grid item xs={12}
          >
            <Button fullWidth>Update photo</Button>
          </Grid>
        </Grid>       */}
        
        <Grid item container xs={12}>
          <Grid item xs={4}
              sx={{
                height: "6vh",
              }}
            >
              <Chip
                label={eventInfo.category}
                icon={categories[eventInfo.category]}
              >
              </Chip>
          </Grid>
          <Grid item xs={8}
            sx={{            
              height: "6vh"
            }}
          >
            <Typography noWrap variant="h6">{eventInfo.event_name}</Typography>
          </Grid>
          <Grid item xs={4}> 

          </Grid>
          <Grid 
            item 
            xs={3}
            sx={{            
              height: "6vh",
            }}
          >
          <Typography variant="h7">{eventInfo.event_location}</Typography>
          </Grid>
          <Grid item xs={5}
            sx={{
              height: "6vh",
            }}
          >
            <Typography variant="h7">{formatEventTime(eventInfo.event_time)}</Typography>
          </Grid>
        </Grid>
      </Grid>

        <Grid item xs={12}
          sx={{
            height: "12vh",
          }}
        > 
          {
            eventInfo.description.length != 0 && 
            <>
              <Typography variant="h6">Description:</Typography>
              <Typography>{eventInfo.description}</Typography>
            </>
          }
          

        </Grid>

        {/* <Grid item xs={12}>
          <Button fullWidth variant="outlined">
          View participants ({event.curr_participants}/{eventInfo.max_participants})</Button>
        </Grid> */}

        <Grid item xs={12}>
          {
            userJoined ? <Button href={event.chat_link} fullWidth variant="outlined">Go to chat</Button> : <></>
          }
        </Grid>

        <Grid item xs={12}>
          {
            !userJoined ? 
            <Button 
              fullWidth
              variant="outlined"
              onClick={() => {
                setUserJoined(true)
                const payload = {
                  participant_id: user.user_id,
                  event_id: event.event_id,
                  max_participants: eventInfo.max_participants
                }
                addUserToEvent(JSON.stringify(payload))
                setUserJoinedSuccessfully(true)
              }}
            >
              Join
            </Button> : <></>
          }
        </Grid>

        <Grid item xs={12}>
          {
            userJoined && !userOwns ? 
            <Button
              fullWidth
              variant="outlined"
              onClick={()=>{
                setUserJoined(false)
                const payload = {
                  user_id: user.user_id,
                  event_id: event.event_id
                }
                deleteUserFromEvent(JSON.stringify(payload))
                setUserLeftSuccessfully(true)
              }}
            >Leave</Button>: <></>
          }
        </Grid>

        <Grid item xs={12}>
          {
            userOwns ? 
            <Button
              fullWidth 
              variant="outlined"
              onClick={()=>{
                setIsEditing(true)
                setEventEditedSuccessfully(false)
              }}
            > Edit </Button> : <></>
          }
        </Grid>
        
        <Grid item xs={12}>
          {
            userOwns ? 
            <DeleteButton
              fullWidth
              variant="outlined"
              event_id={event.event_id}
            /> : <></>
          }
        </Grid>
      </Grid>
      <Drawer
        anchor="bottom"
        open={isEditing}
        onClose={()=>{
          if (tempEventInfo != eventInfo && editingState.event_edited){
            setEventEditedSuccessfully(true)
            setEventInfo(tempEventInfo)
          }
          setIsEditing(false)
          }}
        sx={{zIndex: 'modal'}}
      >
      <h1>Edit event</h1>
      <EditEventForm event={eventInfo} formAction={formAction} setTempEventInfo={setTempEventInfo} error_code={editingState.error_code}/>
    </Drawer>
    </>
    
  )
}



function DeleteButton({ event_id, ...props }){
  const [showDialog, setShowDialog] = useState(false)
  const [eventDeleted, setEventDeleted] = useState(false)
  return (
    <>
      <Button
        {...props}
        onClick={()=>{
          setShowDialog(true)
        }}
      >
      Delete
      </Button>
      <Dialog
        fullWidth
        maxWidth="md"
        open={showDialog}
        onClose={() => {setShowDialog(false)}}
        sx={{
        }}
      >
        <DialogContent>
          Are you sure?
        </DialogContent>
        <DialogActions>
          <Button
            fullWidth
            onClick={()=>{
              const payload = {
                event_id: event_id
              }
              deleteEvent(JSON.stringify(payload))
              setEventDeleted(true)
            }}
          >
            Confirm
          </Button>
          <Button
            fullWidth
            onClick={()=>{setShowDialog(false)}}
          >
            Cancel
          </Button>
          
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen
        open={eventDeleted}
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
            Event deleted</Typography>
            <Button href="/" fullWidth>Home</Button>
          </Stack>
      </Dialog>
    </>
  )
}


function EditButton({setIsEditing, setEventEditedSuccessfully, ...props}){
  return (
    <>
      <Button
        {...props}
        onClick={()=>{
          setEventEditedSuccessfully(false)
          setIsEditing(true)
        }}
      >Edit</Button>
      
    </>
  )
}


function EventEditor({formAction, isEditing, setIsEditing, setEventEditedSuccessfully, eventEditedSuccessfully, eventInfo, setEventInfo}){
  const [tempEventInfo, setTempEventInfo] = useState(null)
  

  return(
    <Drawer
        anchor="bottom"
        open={isEditing}
        onClose={()=>{
          if (editingState.event_edited){
            setEventEditedSuccessfully(editingState.event_edited)
            // setEventInfo(tempEventInfo)
          }
          setIsEditing(false)
          }}
        sx={{zIndex: 'modal'}}
      >
      <h1>Edit event</h1>
      <EditEventForm event={eventInfo} formAction={formAction} setTempEventInfo={setTempEventInfo} />
    </Drawer>
  )
}
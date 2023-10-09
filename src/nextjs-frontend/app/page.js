import { Container, Stack, Button } from '@mui/material'


function MyButton({ children, ...props}){
  return (
  <Button
    {...props}

    variant="outlined"
    sx={{
      width: '100%'
    }}
  >
  {children}
  </Button>)
}

export default function Page( { createEvent }){
  return (

      <Stack 
        spacing={2}
        alignItems="center"
        justifyContent="center"
        useFlexGap
        sx={{
          mt: 25,
        }}
      >
        <MyButton href="/my_events">My events</MyButton>
        <MyButton href="/browse_events">Browse events</MyButton>
        <MyButton href="/create_event">Create new event</MyButton>

      </Stack>
    )
}
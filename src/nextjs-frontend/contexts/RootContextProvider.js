"use client"


import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { UserContext } from '@/contexts/UserContext';
import { validateData } from '@/server_actions/actions';
import { getEventsJoined, getEventsCreated } from "@/server_actions/actions.js"
import { useEffect, useState } from 'react';
import { TelegramContext } from '@/contexts/TelegramContext';


export default function RootContextProvider({ WebApp, children }){
  const [eventsJoined, setEventsJoined] = useState(null)
  const [eventsCreated, setEventsCreated] = useState(null)
  const [validData, setValidData] = useState(null)
  const [recievedValidationResponse, SetRecievedValidationResponse] = useState(false)
  const initData = WebApp.initData
  useEffect(() => {
    async function startFetching() {
      setEventsJoined(null)
      setEventsCreated(null)
      setValidData(null)
      SetRecievedValidationResponse(false)
      
      const queryParams = {
        init_data: initData
      }
      let result = await validateData(JSON.stringify(queryParams))
      if (!ignore) {
        SetRecievedValidationResponse(true)
        setValidData(result)
      }
      let data_is_valid = result.data_is_valid
      if (data_is_valid){
        let user_id = result.parsed_data.user.id
        result = await getEventsJoined(user_id)
        if (!ignore) {
          setEventsJoined(result)
        }
        result = await getEventsCreated(user_id)
        if (!ignore) {
          setEventsCreated(result)
        }
        
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    }
  }, [initData])


  if (recievedValidationResponse && validData) {
    // NEEDS_CHANGE
    const userData={
      user_id: validData.parsed_data.user.id,
      eventsJoined: eventsJoined,
      eventsCreated: eventsCreated,
    }
    return (
      <>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TelegramContext.Provider value={WebApp}>
            <UserContext.Provider value={userData}>
              {children}
            </UserContext.Provider>
          </TelegramContext.Provider>
        </LocalizationProvider>
      </>
    )
  }
}

"use client"


import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { UserContext } from '@/contexts/UserContext';
import { validateData } from '@/server_actions/actions';
import { getEventsJoined, getEventsCreated } from "@/server_actions/actions.js"
import { useEffect, useState } from 'react';
import { TelegramContext } from '@/contexts/TelegramContext';
import Script from 'next/script'


export default function RootContextProvider({ children }){
  const [WebApp, SetWebApp] = useState({});
  return (
    <>
      <Script 
        src="https://telegram.org/js/telegram-web-app.js"
        onLoad={()=>{SetWebApp(window.Telegram.WebApp)}}
      ></Script>
      <Inner WebApp={WebApp}>
        {children}
      </Inner>
    </>
  )
}


function Inner({ WebApp, children }){
  const [eventsJoined, setEventsJoined] = useState(null)
  const [eventsCreated, setEventsCreated] = useState(null)
  const [validData, setValidData] = useState(null)

  useEffect(() => {
    async function startFetching() {
      setEventsJoined(null)
      setEventsCreated(null)
      setValidData(null)
      if (WebApp) {      
        const queryParams = {
          init_data: WebApp.initData
        }
        let result = await validateData(JSON.stringify(queryParams))
        let data_is_valid = result.data_is_valid

        if (data_is_valid){
          if (!ignore) {
            setValidData(result.parsed_data)
          }
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
    }

    let ignore = false;
    startFetching();

    return () => {
      ignore = true;
    }

  }, [WebApp])



  if (validData) {
    const userData={
      user_id: validData.user.id,
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

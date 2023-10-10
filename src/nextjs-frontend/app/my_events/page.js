"use client"

import { useState, useContext, useEffect } from 'react'
import { Box, Button, Tab, Tabs, Typography } from '@mui/material'
import EventList from '@/components/EventList.js';
import { UserContext } from '@/contexts/UserContext';
import { TelegramContext } from '@/contexts/TelegramContext';
import { useRouter } from 'next/navigation'

export default function Page(){
  const router = useRouter()
  const WebApp = useContext(TelegramContext)
  WebApp.BackButton.show()
  WebApp.BackButton.offClick(WebApp.BackButton.prevCallBack)
  const BackButtonCallBack = ()=> router.push('/')
  WebApp.BackButton.onClick(BackButtonCallBack)
  WebApp.BackButton.prevCallBack = BackButtonCallBack

  const user = useContext(UserContext)
  const eventsJoined = user.eventsJoined
  const eventsCreated = user.eventsCreated
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={value} 
          onChange={handleChange} 
          aria-label="basic tabs example"
          variant="fullWidth"
        >
          <Tab label="Events you joined" {...a11yProps(0)} />
          <Tab label="Events you created" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {
          eventsJoined ? 
          (
            eventsJoined.length !== 0 ? 
            <EventList events={eventsJoined}/>
            : "You haven't joined any events yet"
          )
          : "Loading"
        }
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {
          eventsCreated ? 
          (
            eventsCreated.length !== 0 ? 
            <EventList events={eventsCreated}/> 
            : "You haven't created any events yet"
          )
          : "Loading"
        }
      </CustomTabPanel>
    </Box>    
    )
}


function CustomTabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

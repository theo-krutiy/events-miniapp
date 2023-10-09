"use server"

import { revalidatePath, revalidateTag } from 'next/cache'

export async function getEvents(queryParams){
  const response = await fetch(
    "http://backend/events?" + new URLSearchParams(JSON.parse(queryParams)),
    { cache: 'no-store' }
  )
  if (response.status === 200){
    const result = await response.json()
    return result.events
  }
}

export async function createEvent(prevState, payload) {
  const response = await fetch("http://backend/events", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: payload
    })
  
  if (response.status === 400){
    const result = await response.json()
    return { 
      error_code: result.error_code,
      event_created: false
    }
  } else if (response.status === 201){
    return { 
      error_code: null,
      event_created: true
    }
  }
}


export async function editEvent(prevState, payload){
  console.log("prevState", prevState)
  // console.log("event_id", event_id)
  console.log("payload", payload)

  const url = "http://backend/events/" + JSON.parse(payload).event_id
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: payload,
    cache: "no-store"
  })
  

  if (response.status === 400){
    const result = await response.json()
    console.log(result)
    return { 
      error_code: result.error_code,
      event_edited: false
    }
  } else if (response.status === 200){
    return { 
      error_code: null,
      event_edited: true
    }
  }
}


export async function getEventsJoined(userID){
  const url = "http://backend/users/" + userID.toString() + "/events_joined"
  const response = await fetch(url, {cache: "no-store"})
  if (response.status === 200){
    const result = await response.json()
    return result.events_joined
  }
}


export async function getEventsCreated(userID){
  const url = "http://backend/users/" + userID.toString() + "/events_created"
  const response = await fetch(url, {cache: "no-store"})
  if (response.status === 200){
    const result = await response.json()
    return result.events_created
  }
}


export async function addUserToEvent(payload){
  const payload_parsed = JSON.parse(payload)
  const url = "http://backend/events/" + payload_parsed.event_id.toString() + "/participants"
  const result = await fetch(url, {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: payload,
    cache: "no-store"
  })

  if (result.status === 400){
    const response = await result.json()
    console.log(response)
  }
 
}


export async function deleteUserFromEvent(payload){
  const payload_parsed = JSON.parse(payload)
  const url = "http://backend/events/" 
  + payload_parsed.event_id.toString() 
  + "/participants/" 
  + payload_parsed.user_id.toString()

  await fetch(url, {
    method: "DELETE",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    cache: "no-store"
  })
}


export async function deleteEvent(payload){
  const event_id = JSON.parse(payload).event_id
  const url = "http://backend/events/" + event_id.toString()
  const response = await fetch(url, {
    method: "DELETE"
  })
  if (response.status === 400) {
    const result = await response.json()
    console.log(result)
  }
}


export async function validateData(queryParams){
  const url = "http://backend/utils/valid_data?" 
  + new URLSearchParams(JSON.parse(queryParams))

  const response = await fetch(url)

  if (response.status === 200) {
    const result = await response.json()
    return result
  }
  else {
    return {
        "data_is_valid": false,
        "parsed_data": {}
    } 
  }
}
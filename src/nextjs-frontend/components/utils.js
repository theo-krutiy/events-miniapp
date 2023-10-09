import dayjs from "dayjs";


export function formatEventTime(eventTime){
  var isToday = require('dayjs/plugin/isToday')
  dayjs.extend(isToday)
  var isTomorrow = require('dayjs/plugin/isTomorrow')
  dayjs.extend(isTomorrow)

  var dayjs_time = dayjs(eventTime)
  var result = ""
  if (dayjs_time.isToday()){
    result += "Today"
  }
  else if(dayjs_time.isTomorrow()){
    result += "Tomorrow"
  }
  else{
    result += dayjs_time.format("MMMM D[th] YYYY")
  }

  result += dayjs_time.format(" [at] HH:mm")

  return result
}
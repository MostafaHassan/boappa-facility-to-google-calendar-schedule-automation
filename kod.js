const boappa_api_url = 'https://wapi.boappa.se';
var swedishTimeZone = "Europe/Stockholm";
const days_to_search = 30;
const debug = true;

function main() {
  const credentials = LoginToBoAppaAndGetCredentials()

  const society_id = GetSocietyId(credentials.user_id, credentials.token)
  if(debug)console.log(`Society id is: ${society_id}`)

  const facilities = GetFacilities(credentials.token, society_id)
  if(debug)console.log(facilities)
  /*
  //facility_id: jsonData.data[x]._id,
  //facility_name: jsonData.data[x]._name,
  //facility_is_bookable: jsonData.data[x].booking
  */

  var currentDate = new Date();
  // Get the timestamp in milliseconds since epoch
  var currentTimestamp = currentDate.getTime();
  
  if(debug)console.log(`Current time stamp: ${currentTimestamp}`);

  // Add 30 days (30 * 24 * 60 * 60 * 1000 milliseconds)
  var futureDate = new Date(currentDate.getTime() + (days_to_search * 24 * 60 * 60 * 1000));
  
  // Get the timestamp in milliseconds since epoch
  var futureTimestamp = futureDate.getTime();
  if(debug)console.log(`30 days in the future time stamp: ${futureTimestamp}`);

  // Contains all bookable rooms, each room contains reserverations [[]]
  const reservationsPerFacility = GetFacilitiesReservations(credentials.token, facilities, currentTimestamp, futureTimestamp)

  var list_of_reservations_to_create = []
  for(var x in reservationsPerFacility)
  {
      const reservationForCurFacility = reservationsPerFacility[x];
      //if(debug)console.log(reservationForCurFacility)
  
      for(const reservation in reservationForCurFacility)
      {
        const reservation_details = reservationForCurFacility[reservation];

        const curr_start_date = reservation_details.startDate;
        const curr_end_date = reservation_details.endDate;
        const curr_facility_id = reservation_details.facilityId;
        const curr_society_id = reservation_details.societyId;
        const curr_unitId = reservation_details.unitId;
        const curr_user_id = reservation_details.userId;

        const curr_facility_name = GetFacilityNameFromFacilityId(curr_facility_id, facilities);
        const curr_name = GetUserNameAndSurname(curr_user_id, credentials.token);

        if(curr_society_id === society_id)
        {
          // Create unique title for this reservation
          const curr_title = `${curr_facility_name} - ${curr_name} - ${curr_start_date} - ${curr_end_date}`
          if(debug)console.log(curr_title)

          const new_reservation = {
            title: curr_title,
            start_date: curr_start_date,
            end_date: curr_end_date
          }
          list_of_reservations_to_create.push(new_reservation);
        }
      }
  }

  CreateCalendarEvents(list_of_reservations_to_create)
}
  
function LoginToBoAppaAndGetCredentials(){
  var boappa_username = PropertiesService.getScriptProperties().getProperty('boappa_username');
  var boappa_password = PropertiesService.getScriptProperties().getProperty('boappa_password');
  const url = `${boappa_api_url}/users/login`
  
  var payload = JSON.stringify({
    email: boappa_username,
    password: boappa_password
  });

  var headers = {
    'Content-Type': 'application/json'
  };

  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: payload,
    headers: headers
  };

  var response = UrlFetchApp.fetch(url, options);
  var jsonData = JSON.parse(response.getContentText());

  try{
    const user_id = jsonData.data.user._id;
    const token = jsonData.data.token;

    return {
      token: token,
      user_id: user_id
    };
  }
  catch{
    console.error("Something went wrong when signing in")
    return null;
  }
}

function GetSocietyId(user_id, token){
  const url = `${boappa_api_url}/units/get-user-units/${user_id}`

  var headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  var options = {
    method: 'get',
    contentType: 'application/json',
    headers: headers
  };

  var response = UrlFetchApp.fetch(url, options);
  var jsonData = JSON.parse(response.getContentText());
  if(jsonData.data.length > 0)
  {
    return jsonData.data[0].societyId
  }
  return null
}

function GetUserNameAndSurname(user_id, token){
  const url = `${boappa_api_url}/users/user/${user_id}?populate=media`

  var headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  var options = {
    method: 'get',
    contentType: 'application/json',
    headers: headers
  };

  var response = UrlFetchApp.fetch(url, options);
  var jsonData = JSON.parse(response.getContentText());
  if(jsonData.data != null)
  {
    const firstName = jsonData.data.name;
    const lastName = jsonData.data.surname;
    
    return `${firstName} ${lastName}`
  }
  return null
}

function GetFacilities(token, society_id){
  const url = `${boappa_api_url}/facilities/get-per-societies/?populate=media`

  var headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  var payload = JSON.stringify({
    societyIds: [society_id]
  });

  var options = {
    method: 'get',
    contentType: 'application/json',
    payload: payload,
    headers: headers
  };

  var response = UrlFetchApp.fetch(url, options);
  var jsonData = JSON.parse(response.getContentText());
  if(jsonData.data.length > 0)
  {
    var facilitiy_Objs = [];
    for(var x in jsonData.data)
    {
      const _facility = {
        facility_id: jsonData.data[x]._id,
        facility_name: jsonData.data[x].name,
        facility_is_bookable: jsonData.data[x].booking
      }
      facilitiy_Objs.push(_facility)

    }
    return facilitiy_Objs
  }
  return null
}

function GetFacilityNameFromFacilityId(facility_id, facilities)
{
  for(var x in facilities)
  {
      if(facilities[x].facility_id == facility_id)
      {
        return facilities[x].facility_name;
      }
  }
}

function GetFacilitiesReservations(token, listOfFacilities, fromDate, toDate){
  var facilityReservations = []

  for(var x in listOfFacilities)
  {
    const facilityObj = listOfFacilities[x];

    const fr = GetFacilityReservations(token, facilityObj, fromDate, toDate);
    facilityReservations.push(fr);
  }

  return facilityReservations;
}

// fromDate and toDate is in milliseconds since the Unix epoch (January 1, 1970)
function GetFacilityReservations(token, facilityObj, fromDate, toDate){
  const facility_id = facilityObj.facility_id

  const url = `${boappa_api_url}/bookings/get-per-facility/${facility_id}?populate=users.media%3Bunits.entrances&fromDate=${fromDate}&toDate=${toDate}`

  var headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  var options = {
    method: 'get',
    contentType: 'application/json',
    headers: headers
  };

  var response = UrlFetchApp.fetch(url, options);
  var jsonData = JSON.parse(response.getContentText());
  if(jsonData.data.length > 0)
  {
    return jsonData.data;
  }
  return null
}

function CreateCalendarEvents(list_of_reservations_to_create) {
  //var calendar = CalendarApp.getDefaultCalendar();
  var calendar_id = PropertiesService.getScriptProperties().getProperty('calendar_id');
  var calendar = CalendarApp.getCalendarById(calendar_id);

  // Search for event 30 days into the future
  var now = new Date();
  var end = new Date();
  end.setDate(now.getDate() + days_to_search);

  var existingEvents = calendar.getEvents(now, end);
  var existingTitles = existingEvents.map(function(event) {
    return event.getTitle();
  });

  // Extract titles to keep from the list of reservations
  var titlesToKeep = list_of_reservations_to_create.map(function(reservation) {
    return reservation.title;
  });

  for (var i = 0; i < existingEvents.length; i++) {
    var event = existingEvents[i];
    var eventTitle = event.getTitle();

    // Check if the event title is not in the list
    if (titlesToKeep.indexOf(eventTitle) === -1) {
      // Delete the event if the title is not in the list
      event.deleteEvent();
      Logger.log('Deleted event: ' + eventTitle);
    }
  }
  

  for(x in list_of_reservations_to_create)
  {
    var reservation = list_of_reservations_to_create[x];

      if(debug)console.log(`Creating event: ${reservation.title}`)

      var timeZoneOffsetMinutes = new Date().getTimezoneOffset(); // Offset in minutes
      var timeZoneOffsetHours = timeZoneOffsetMinutes / 60; // Convert to hours

      // Adjust the time for the desired time zone
      var _start = new Date(new Date(reservation.start_date).getTime() + timeZoneOffsetHours * 60 * 60 * 1000);
      var _end = new Date(new Date(reservation.end_date).getTime() + timeZoneOffsetHours * 60 * 60 * 1000);
      
      calendar.createEvent(reservation.title, _start, _end);

      /*
      , {
        //description: eventDescription,
        //location: eventLocation,
        timeZone: swedishTimeZone
      }
      */
  }
}
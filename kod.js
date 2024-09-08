const boappa_api_url = 'https://wapi.boappa.se';

function main() {
  const credentials = LoginToBoAppaAndGetCredentials()
  //console.log("token is: " + credentials.token)
  //console.log("user id is: " + credentials.user_id)

  const society_id = GetSocietyId(credentials.user_id, credentials.token)
  console.log(`Society id is: ${society_id}`)

  const facilities = GetFacilities(credentials.user_id, credentials.token, society_id)
  console.log(facilities)
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

  const user_id = jsonData.data.user._id;
  const token = jsonData.data.token;

  return {
    token: token,
    user_id: user_id
  };
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

function GetFacilities(user_id, token, society_id){
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
    var facilitiy_ids = [];
    for(var x in jsonData.data)
    {
      var facility_id = jsonData.data[x]._id;
      facilitiy_ids.push(facility_id)

    }
    return facilitiy_ids
  }
  return null
}
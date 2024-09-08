const boappa_api_url = 'https://wapi.boappa.se';

function main() {
  const credentials = loginToBoAppaAndGetCredentials()
  console.log("token is: " + credentials.token)
  console.log("user id is: " + credentials.user_id)

  //createCalendarEvents()
}
  
function loginToBoAppaAndGetCredentials(){
  var boappa_username = PropertiesService.getScriptProperties().getProperty('boappa_username');
  var boappa_password = PropertiesService.getScriptProperties().getProperty('boappa_password');

  
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

  const url = boappa_api_url + "/users/login"
  var response = UrlFetchApp.fetch(url, options);
  var jsonData = JSON.parse(response.getContentText());

  const user_id = jsonData.data.user._id;
  const token = jsonData.data.token;

  return {
    token: token,
    user_id: user_id
  };
}
const searchButton = document.getElementById("search_button");
searchButton.addEventListener("click", callAPI, false);

const resetButton = document.getElementById("reset_button");
resetButton.addEventListener("click", resetResults, false);
resetButton.disabled = true;

const baseOutput = "Type the name of the city in the input field, then click SEARCH to get its weather";
const waitingOutput = "Your call is being processed, please wait";
const successfulCall = "Your call was successful! Here are the results for ";

const outputStateText = document.getElementById("output_control_text");
outputStateText.textContent = baseOutput;

const WEATHER_API_KEY = "3127cee09dcf94afcea237915dc5cb77";
// For best practice should be hidden (both in the API call and in the code repository), but requires additional tools/libs, techniques

/**
 * Generates the full http request for Geocoding feature provided by OpenWeather - https://openweathermap.org/api/geocoding-api
 * @param location - the place (city, town, village) where we want to check the weather. Majority of the world's most popular languages is included, Polish and English withstanding.
 * @returns {string} - the complete HTTP request, that allows us to obtain the geographical coordinates of the aforementioned place for another API call
 */
function getGeocodingAPILink(location) {
    return `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${WEATHER_API_KEY}`;
}

/**
 * Generates the full http request for Current weather data feature provided by OpenWeather - https://openweathermap.org/current
 * @param latitude - geographical coordinate of the place where we want to check the weather, indicating placement of the location in the south-north axis
 * @param longitude - geographical coordinate of the place where we want to check the weather, indicating placement of the location in the east-west axis
 * @returns {string} - the complete HTTP request that will get us the data about the current weather in the given location.
 */
function getCurrentWeatherAPILink(latitude, longitude) {
    return `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`
}

/**
 * The function wraps the error data in an additional phrase, to make the output more user-friendly
 * @param errorData - error's code, status or message derived from the fetch's response
 * @returns {string} - user-friendly error message.
 */
function returnErrorMessage(errorData) {
    return `The API call failed due to ${errorData}`;
}

/**
 * Function that transforms the input field data into the information about the weather in the given location, by performing necessary API calls and parsing the returned data
 * @param e - event fired when a SEARCH button is pressed
 */
async function callAPI(e) {
    e.preventDefault()

    const input_field = document.getElementById('place_input');

    //1. Set-up waiting for results in display
    outputStateText.textContent = waitingOutput;

    //2. Call weather API
    const location = input_field.value;
    const reg = /[0-9!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]/g;

    if (reg.test(location)) {
        outputStateText.textContent = returnErrorMessage(`incompatible input. Please provide a location name without any numbers and special signs. It can only consist of letters, a space and a dash.`);
        return;
    }

    //a. Convert location name to latitude and longitude
    try {
        const response = await fetch(getGeocodingAPILink(location));
        if (!response.ok) {
            outputStateText.textContent = returnErrorMessage(`(GeoCoding) - response status: ${response.status}`);
            return;
        }

        const geocodingJson = await response.json();

        if (geocodingJson.length === 0){
            outputStateText.textContent = returnErrorMessage(`(GeoCoding) - the location you provided is not recognized by the API`);
            return;
        }
        const latitude = geocodingJson[0].lat;
        const longitude = geocodingJson[0].lon;

        //b. call the API for current weather
        const weatherResponse = await fetch(getCurrentWeatherAPILink(latitude, longitude));
        if (!response.ok) {
            outputStateText.textContent = returnErrorMessage(`(Current Weather) - response status: ${response.status}`);
            return;
        }

        const weatherJson = await weatherResponse.json();

        const temperature = Math.round(weatherJson.main.temp);
        const clouds = weatherJson.clouds.all;
        const wind = weatherJson.wind.speed;
        const weather = weatherJson.weather[0].main;
        const weatherDescription = weatherJson.weather[0].description;
        const pressure = weatherJson.main.pressure;
        const country = weatherJson.sys.country;

        const weatherStatistics = [["temperature", temperature, "°C"], ["cloudiness", clouds, "%"], ["wind speed", wind, "m/s"],
            ["weather type", weather, ""], ["weather description", weatherDescription, ""], ["pressure", pressure, "hPa"]];


        //3. Display results or error
        outputStateText.innerHTML = `${successfulCall} <strong>${location}, ${country}</strong>.`

        const weatherInfo = document.createElement('ul');
        weatherInfo.setAttribute("id", "weather_info");
        document.getElementById('output_div').appendChild(weatherInfo);

        for (const infoTuple of weatherStatistics){
            const stat = document.createElement('li');
            stat.innerHTML = `<strong>${infoTuple[0]}</strong>: ${infoTuple[1]} ${infoTuple[2]}`;
            weatherInfo.appendChild(stat);
        }

    } catch (error) {
        outputStateText.textContent = returnErrorMessage(error.message);
    }

    //4. Clear input field
    input_field.value = "";

    //5. Block the SEARCH button until the RESET button is pressed
    searchButton.disabled = true;

    //6. Enable RESET button
    resetButton.disabled = false;

}

/**
 * The function clears the weather output (both the state text and the weather parameters) previously produced by the API calls, going back to the default display
 * @param e - event fired when a RESET button is pressed
 */
function resetResults(e) {
    e.preventDefault()

    //1. return to default state text
    outputStateText.textContent = baseOutput;

    //2. clear city weather output
    document.getElementById('weather_info').remove();

    //3. Unlock the SEARCH button
    searchButton.disabled = false;

    //4. disable RESET button
    resetButton.disabled = true;
}
// This is for next week, but let's see our progress in action!
const render = (htmlString, longString) => {
    document.querySelector('#facts').innerHTML = htmlString;
    document.querySelector('#lstring').innerHTML = longString;
};

// render weather output to html
const renderWeather = (outlook) => {
    document.querySelector('#responseField').innerHTML = outlook;
};

// render random activity to html
const renderActivity = (activity) => {
    document.querySelector('#activity').innerHTML = `${activity}.`;
};

// Cat facts API fetch
// We need to create an async function to deal with the server response time!
const getData = async () => {
    const dataCollection = [];
    const randomCollection = [];

    // fetch 100 random facts from API
    const response = await fetch('https://catfact.ninja/facts?limit=100');
    const data = await response.json();
    data.data.forEach((x) => dataCollection.push(`<li><em>${x.fact}</em></li>`));

    // Task 1.
    // creating a random number to output a random cat facts
    const randomNumber = Math.floor(Math.random() * 100);
    const oneFact = dataCollection[randomNumber];

    // Task 4.
    // push random 8 facts to show
    let j = randomCollection.length;
    while (j < 8) {
        const randomNumber2 = Math.floor(Math.random() * 100);
        const randomFacts = dataCollection[randomNumber2];
        if (!randomCollection.includes(randomFacts)) {
            randomCollection.push(`${randomFacts}`);
            j += 1;
        }
    }

    // render to HTML
    render(oneFact, randomCollection.join(''));
};

// run fetching API method and output data to HTML
getData();

// Random Activity API Fetch with method being called in html file button onclick.
const getData2 = async () => {
    await fetch('https://www.boredapi.com/api/activity')
        .then((response) => response.json(), (networkError) => console.log(networkError.message))
        .then((data) => renderActivity(data.activity));
};

// The asynch await is the newer version of asynch js, so let's try and use that.
// We need the .json() because we are probably getting the data as a json file
const weatherButton = document.querySelector('#find');
const responseField = document.querySelector('#responseField');

const getWeatherData = async () => {
    const TOCELCIUS = 273.15;
    const weatherOutput = {};
    const APIkey = '&appid=<insert API Key here>';
    const wordInput = document.getElementById('text1').value;
    const url = 'https://api.openweathermap.org/data/2.5/weather';
    const query = '?q=';
    const endpoint = `${url}${query}${wordInput}${APIkey}`;

    try {
        const response = await fetch(endpoint);
        if (response.ok) {
            const jsonResponse = await response.json();

            weatherOutput.name = jsonResponse.name;
            weatherOutput.outlook = jsonResponse.weather[0].main;
            weatherOutput.maxTemp = Math.trunc(jsonResponse.main.temp_max - TOCELCIUS);
            weatherOutput.minTemp = Math.trunc(jsonResponse.main.temp_min - TOCELCIUS);
            weatherOutput.currTemp = Math.trunc(jsonResponse.main.temp - TOCELCIUS);

            const weatherDisplay = `
            <li><u><em>${weatherOutput.name}</em></u></li>
            <li>Outlook: ${weatherOutput.outlook}</li>
            <li>Current Temp: ${weatherOutput.currTemp} °C</li>
            <li>Max Temp: ${weatherOutput.maxTemp} °C</li>
            <li>Min Temp: ${weatherOutput.minTemp} °C</li>
            `;
            renderWeather(weatherDisplay);
        } else {
            throw new Error('Request Failed!');
        }
    } catch (error) {
        renderWeather('Location not Found!');
    }
};

// Clear previous results and display results to webpage
const displaySuggestions = (event) => {
    event.preventDefault();
    while (responseField.firstChild) {
        responseField.removeChild(responseField.firstChild);
    }
    return getWeatherData() || 'Location not known!';
};

weatherButton.addEventListener('click', displaySuggestions);

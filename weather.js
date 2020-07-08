/* 
     Declaring DOM elements
 */
const getWeather = document.getElementById("search"),
    userInput = document.getElementById("user-input"),
    error = document.getElementById("error"),
    result = document.getElementById("results"),
    resultTable = document.getElementById("result-table"),
    closeButtons = document.getElementsByClassName("close");

/*
     Functions:
 */

const pairCloseButtons = elements => {
    for (let each of elements) {
        each.onclick = function () {
            this.parentElement.classList.remove("fade-in");
            this.parentElement.classList.add("fade-out");
            // we want our error div to no longer take up space
            const displayNone = () => {
                this.parentElement.style.display = "none";
            };
            // if we don't set timeout, we miss our ~BEAUTIFUL~ animation
            return setTimeout(displayNone, 300);
        };
    }
};

/*
     Error messages:
 */
const showErrors = el => {
    for (let each of el) {
        each.style.display = "block";
    }
};

/*
    converting Kelvins to Fahrenheit
 */
const convertTemp = K => (1.8 * (K - 273) + 32).toFixed(2);


String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};


/*
days in week
*/
const getWeekDay = (date) => {
    //Create an array containing each day, starting with Sunday.
    let weekdays = new Array(
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    );
    //Use the getDay() method to get the day.
    let day = date.getDay();
    //Return the element that corresponds to that index.
    return weekdays[day];
}



/* ====================
 * API call will do it for us,
 * but we should be extra sure and replace
 * whitespace in city names as %20
 * ====================
 */
String.prototype.fixWhiteSpace = function () {
    return this.replace(/ /g, "%20");
};

/*
	Window / Button Functionality:
*/
window.onload = function () {
    pairCloseButtons(closeButtons);
};

// GET WEATHER
const getWeatherData = () => {


    let city = userInput.value.trim();
    let publicKey = `8fd8cd4cfceeb698eef7a7cd4ea325cc`;
    let lon;
    let lat;
    let apiCallCurrentWeather = `http://api.openweathermap.org/data/2.5/weather?q=${city.fixWhiteSpace()}&appid=${publicKey}`;
    console.log(apiCallCurrentWeather);

    fetch(apiCallCurrentWeather)
        .then(response => response.json())
        .catch(e => {
            console.error(`Retreival error: ${e}`);
        })
        .then(data => {
            /* [0] holds all the most recent info, if we wanted all the info
			  we could simply cycle through all of the elements.
        */
            console.log(data.coord.lon);
            const lon = data.coord.lon;
            const lat = data.coord.lat;
            const cityName = data.name;
            const country = data.sys.country;

            result.innerHTML = `

            <div><span>City:</span> ${cityName}</div>
            <div><span>Country:</span> ${country}</div>
    
            `;

            // fetching second (one) API

            let apiCallOne = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&
            &appid=${publicKey}`;


            //second fetch

            fetch(apiCallOne)
                .then(response => response.json())
                .catch(e => {
                    console.error(`Retreival error: ${e}`);
                })
                .then(data => {


                    console.log(apiCallOne);

                    const loni = data.timezone;

                    console.log(loni);

                    const resultDiv = document.getElementById("search-result"),
                        errorDiv = document.getElementById("errorContainer");
                    errorDiv.style.display = "none"; // if results, no error
                    resultDiv.style.display = "block"; // if results, display
                    window.scrollTo(0, 200); //scroll if window is too small to view results.

                    //create table

                    const tableHead = document.getElementById('table-head')
                    const tableBody = document.getElementById('table-body');

                    let tr = document.createElement('tr');
                    tr.innerHTML = `<th scope="col"></th>
                    <th scope="col">Weather</th>
                    <th scope="col">Temperature</th>
                    <th scope="col">Min Temperature</th>
                    <th scope="col">Max Temperature</th>`;

                    tableHead.appendChild(tr);

                    //loop throught days

                    for (let i = 0; i < 7; i++) {

                        //const day = data.daily[i].dt;
                        let getDay = new Date(data.daily[i].dt * 1000);
                        let date = getDay.getDate();
                        let month = getDay.getMonth() + 1;
                        let day = `${month}. ${date}.`;
                        let weekDay = getWeekDay(getDay);



                        const weather = data.daily[i].weather[0].description;
                        let temp = data.daily[i].temp.day;
                        temp = convertTemp(temp);
                        let minTemp = data.daily[i].temp.min;
                        minTemp = convertTemp(minTemp);
                        let maxTemp = data.daily[i].temp.max;
                        maxTemp = convertTemp(maxTemp);
                        const icon = data.daily[i].weather[0].icon;
                        console.log(data.daily[i].sunrise);
                        console.log(data.daily[i].dt);

                        //html 

                        let tr = document.createElement('tr');
                        tr.innerHTML = `<th scope="row">${weekDay}</th>
                            <td><span class="icon"><img src="http://openweathermap.org/img/wn/${icon}.png" alt="${icon}"></span><span>${weather}</span></td>
                            <td>${temp}</td>
                            <td>${minTemp}</td>
                            <td>${maxTemp}</td>`;

                        tableBody.appendChild(tr);




                    }


                })
        })
        .catch(e => {
            let resultDiv = document.getElementById("search-result"),
                errorDiv = document.getElementById("errorContainer"),
                errorMsg = document.getElementById("error");
            resultDiv.style.display = "none"; // if error, no results
            errorDiv.style.display = "block"; // display error
            errorDiv.classList.remove("fade-out"); // fade animations
            errorDiv.classList.add("fade-in"); // fade animations
            errorMsg.innerHTML = `Cannot find: ${city}!`; // display error msg.
            console.error(`Data Error: ${e} \n city probably does not exist`);
        });



};
//search click
getWeather.onclick = function () {
    getWeatherData();
};

// search enter
userInput.onkeydown = function (e) {
    if (e.key === 'Enter') getWeatherData();
};
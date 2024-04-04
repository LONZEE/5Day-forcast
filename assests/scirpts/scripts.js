let weather = { // Object to store the weather data
    fetchWeather: function (city){ // Function to fetch the weather data
        var city = document.querySelector("#cityInput").value;  // Get the city name from the input field
        fetch("https://api.openweathermap.org/data/2.5/forecast?q="+city+"&appid=0a79e530b6c32c8e536eb3c555d5ca37")
        .then(response => response.json())
        .then(data => {
            document.querySelector("#cityName").innerHTML = city.toUpperCase(); // Display the city name
            let cities = JSON.parse(localStorage.getItem("cities")) || [];  // Get the cities from the local storage
            cities.push(city);  // Add the city to the cities array
            localStorage.setItem("cities", JSON.stringify(cities));     // Save the cities array to the local storage
            updateCityList(cities);           
            for(let i=0; i<5; i++){
                const temp = data.list[i*8].main.temp; // Get the temperature for every 8th item (every 24 hours)
                const icon = data.list[i*8].weather[0].icon;
                console.log(temp);
                document.querySelector("#weatherContainer").style.display = "block";
                document.querySelector("#day"+(i+1)).innerHTML = "Temp in "+ city + " on day "+(i+1)+": "+ Number(temp - 273.15).toFixed(1) + "°C";
                document.querySelector("#icon"+(i+1)).innerHTML = "<img src='http://openweathermap.org/img/w/" + icon + ".png' alt='icon'>";
                document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + city + "')";
            }
        })
        .catch(err => alert("City not found"));
    }
};

function handleWeatherFetch(){
    weather.fetchWeather();
}

document.querySelector("#searchButton").addEventListener("click", weather.fetchWeather);
document.querySelector("#cityInput").addEventListener("keyup", function(event){
    if(event.keyCode === 13){
        handleWeatherFetch();
    }
});

function updateCityList(cities) {
    // Get the city list element
    let cityList = document.querySelector("#cityList");
    // Clear the list
    cityList.innerHTML = "";
    while(cities.length > 5){
        cities.shift();
    }
    // Add each city to the list
    cities.forEach(city => {
        let listItem = document.createElement("li");
        listItem.textContent = city;
        listItem.addEventListener("click", () => {
            cities.forEach(city => {
                weather.fetchWeather(city);
            });
        });
        cityList.appendChild(listItem);
    });
    localStorage.setItem("cities", JSON.stringify(cities));
}

// Load the city list when the page loads
window.addEventListener("load", () => {
    let cities = JSON.parse(localStorage.getItem("cities")) || [];
    updateCityList(cities);
});
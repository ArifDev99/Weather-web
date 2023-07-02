
//Declare a variable to store the searched city
var city="";
var latitude="";
var longitude="";
// variable declaration
var searchCity = $("#search-city");
var weatherDesc = $("#desc");
var searchButton = $("#search-button");
var clearButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var TemperatureCelcius = $("#temperature2");
var currentHumidty= $("#humidity");
var currentWSpeed=$("#wind-speed");
var currentUvindex= $("#uv-index");
var bg_img=$("#Bg_img");
var sCity=[];
// searches the city to see if it exists in the entries from the storage
function find(c){
    for (var i=0; i<sCity.length; i++){
        if(c.toUpperCase()===sCity[i]){
            return -1;
        }
    }
    return 1;
}
//Set up the API key
// var APIKey="a0aca8a89948154a4182dcecc780b513";
var APIKey="e680661ad0c376e77d98d26d2b543872";
// Display the curent and future weather to the user after grabing the city form the input text box.
function  displayWeather(event){
    event.preventDefault();

    if(searchCity.val().trim()!==""){
        city=searchCity.val().trim();
        cityName=city.split(",")[0]
        regionCode=city.split(",")[1]
        countyCode=city.split(",")[2]
        
        console.log("cityname",cityName);
        console.log("regionCode",regionCode);
        console.log("countryCode",countyCode);
        const settings = {
            async: true,
            crossDomain: true,
            url: `https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${countyCode}/regions/${regionCode}/cities?namePrefix=${cityName}`,
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '89d44d4d81msha9a4e51bf91b513p1300a4jsn802dc9cb0fa2',
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        };
        
        $.ajax(settings).done(function (response) {
            console.log("geo-db",response);
            latitude=response.data[0].latitude
            longitude=response.data[0].longitude
            // console.log("lat",latitude);
            // console.log("lon",longitude);
            currentWeather(latitude,longitude);
        });

    }
}

function getImage(weather){
    if(weather==="Clouds"){
        return "Cloudy.jpg";

    }
    if(weather==="Clear"){
        return "Clear.jpg"
    }
    if(weather==="Rain"){
        return "Rain.jpg"
    }
    if(weather==="Thunderstorm"){
        return "Thunder.jpg"
    }
    if(weather==="Mist"){
        return "Mist.jpg"
    }
    if(weather==="Haze"){
        return "Haze.jpg"
    }
    if(weather==="Snow"){
        return "Snow.jpg"
    }
    return ;
}
// Here we create the AJAX call
function currentWeather(lat,lon){
    console.log(lat);
    console.log(lon);
    // Here we build the URL so we can get a data from server side.
    // var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    var queryURL= `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}`;
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response){

        // parse the response to display the current weather including the City name. the Date and the weather icon. 
        console.log(response);
        //Dta object from server side Api for icon property.

        $(bg_img).attr("src",`./image/${getImage(response.weather[0].main)}`);
        
        var weathericon= response.weather[0].icon;
        var iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        var tempC = (response.main.temp - 273.15) ;
        $(hero_temperature).html((tempC).toFixed(2)+"&#8451"+"<img src="+iconurl+">");
        // The date format method is taken from the  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
        var date=new Date(response.dt*1000).toLocaleDateString();
        //parse the response for name of city and concanatig the date and icon.
        $(currentCity).html(response.name);
        $(today_date).html("("+date+")");
        // parse the response to display the current temperature.
        // Convert the temp to fahrenheit
        $(weatherDesc).html("Feel Like "+(response.weather[0].description).toUpperCase());
        $(currentTemperature).html((tempF).toFixed(2)+"&#8457");
        $(TemperatureCelcius).html((tempC).toFixed(2)+"&#8451");
        // Display the Humidity
        $(currentHumidty).html(response.main.humidity+"%");
        //Display Wind speed and convert to MPH
        var ws=response.wind.speed;
        var windsmph=(ws*2.237).toFixed(1);
        $(currentWSpeed).html(windsmph+"MPH");
        // Display UVIndex.
        //By Geographic coordinates method and using appid and coordinates as a parameter we are going build our uv query url inside the function below.
        UVIndex(response.coord.lon,response.coord.lat);
        forecast(response.id);
        if(response.cod==200){
            sCity=JSON.parse(localStorage.getItem("cityname"));
            console.log(sCity);
            if (sCity==null){
                sCity=[];
                sCity.push(response.name.toUpperCase()
                );
                localStorage.setItem("cityname",JSON.stringify(sCity));
                addToList(response.name);
            }
            else {
                if(find(city)>0){
                    sCity.push(response.name.toUpperCase());
                    localStorage.setItem("cityname",JSON.stringify(sCity));
                    addToList(response.name);
                }
            }
        }

    });
}
function lastWeather(city){
    // Here we build the URL so we can get a data from server side.
    var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    // var queryURL= `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}`;
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response){

        // parse the response to display the current weather including the City name. the Date and the weather icon. 
        console.log(response);
        // Convert the temp to fahrenheit
        //Dta object from server side Api for icon property.
        $(bg_img).attr("src",`./image/${getImage(response.weather[0].main)}`);


        var weathericon= response.weather[0].icon;
        var iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        var tempC = (response.main.temp - 273.15) ;
        $(hero_temperature).html((tempC).toFixed(2)+"&#8451"+"<img src="+iconurl+">");
        // The date format method is taken from the  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
        var date=new Date(response.dt*1000).toLocaleDateString();
        //parse the response for name of city and concanatig the date and icon.
        $(currentCity).html(response.name);
        $(today_date).html("("+date+")");
        // parse the response to display the current temperature.
        $(weatherDesc).html("Feel Like "+(response.weather[0].description).toUpperCase());
        $(currentTemperature).html((tempF).toFixed(2)+"&#8457");
        $(TemperatureCelcius).html((tempC).toFixed(2)+"&#8451");
        // Display the Humidity
        $(currentHumidty).html(response.main.humidity+"%");
        //Display Wind speed and convert to MPH
        var ws=response.wind.speed;
        var windsmph=(ws*2.237).toFixed(1);
        $(currentWSpeed).html(windsmph+"MPH");
        // Display UVIndex.
        //By Geographic coordinates method and using appid and coordinates as a parameter we are going build our uv query url inside the function below.
        UVIndex(response.coord.lon,response.coord.lat);
        forecast(response.id);
        if(response.cod==200){
            sCity=JSON.parse(localStorage.getItem("cityname"));
            console.log(sCity);
            if (sCity==null){
                sCity=[];
                sCity.push(city.toUpperCase()
                );
                localStorage.setItem("cityname",JSON.stringify(sCity));
                addToList(city);
            }
            else {
                if(find(city)>0){
                    sCity.push(city.toUpperCase());
                    localStorage.setItem("cityname",JSON.stringify(sCity));
                    addToList(city);
                }
            }
        }

    });
}
    // This function returns the UVIindex response.
function UVIndex(ln,lt){
    //lets build the url for uvindex.
    var uvqURL="https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+"&lat="+lt+"&lon="+ln;
    $.ajax({
            url:uvqURL,
            method:"GET"
            }).then(function(response){
                $(currentUvindex).html(response.value);
            });
}
    
// Here we display the 5 days forecast for the current city.
function forecast(cityid){
    var dayover= false;
    var queryforcastURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+APIKey;
    $.ajax({
        url:queryforcastURL,
        method:"GET"
    }).then(function(response){
        
        for (i=0;i<5;i++){
            var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            var iconcode= response.list[((i+1)*8)-1].weather[0].icon;
            var iconurl="https://openweathermap.org/img/wn/"+iconcode+".png";
            var tempK= response.list[((i+1)*8)-1].main.temp;
            var tempC=(tempK-273.15).toFixed(2);
            var humidity= response.list[((i+1)*8)-1].main.humidity;
        
            $("#fDate"+i).html(date);
            $("#fImg"+i).html("<img src="+iconurl+">");
            $("#fTemp"+i).html(tempC+"&#8451");
            $("#fHumidity"+i).html(humidity+"%");
        }
        
    });
}

//Daynamically add the passed city on the search history
function addToList(c){
    var listEl= $("<li>"+c.toUpperCase()+"</li>");
    $(listEl).attr("class","list-group-item  border border-light");
    $(listEl).attr("data-value",c.toUpperCase());
    $(listEl).attr("style","background-color:#d5d3d336");
    $(".list-group").append(listEl);
}
// display the past search again when the list group item is clicked in search history
function invokePastSearch(event){
    var liEl=event.target;
    if (event.target.matches("li")){
        city=liEl.textContent.trim();
        lastWeather(city);
    }

}

// render function
function loadlastCity(){
    $("ul").empty();
    var sCity = JSON.parse(localStorage.getItem("cityname"));
    if(sCity!==null){
        sCity=JSON.parse(localStorage.getItem("cityname"));
        for(i=0; i<sCity.length;i++){
            addToList(sCity[i]);
        }
        city=sCity[i-1];
        lastWeather(city);
    }

}
//Clear the search history from the page
function clearHistory(event){
    event.preventDefault();
    sCity=[];
    localStorage.removeItem("cityname");
    document.location.reload();

}
//Click Handlers
$("#search-button").on("click",displayWeather);
$(document).on("click",invokePastSearch);
$(window).on("load",loadlastCity);
$("#clear-history").on("click",clearHistory);

"use strict";

$(function () {

    // Sets location of map on load
    getWeather(29.4241, -98.4936, 'us');


    // Function containing html and JS instructions from Dark Sky with latitude and longitude input from Mapbox
    function getWeather(latitude, longitude, units) {
        let weather = $.ajax("https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/" + darkSkyToken + "/" + latitude + ',' + longitude + "?units=" + units);
        weather.done(function (weather) {
            console.log(weather);

            //Dark Sky html location variable
            // let darkSkyCoordinates = '"' + weather.latitude + "," +weather.longitude + '"';

            //Accessing API object to convert their time property to date/time
            const dateObject = new Date(weather.currently.time * 1000);
            console.log(dateObject.toString());


            // Fetch day of the week
            function dayOfWeek() {
                let dateInfo = dateObject.toString();
                let day = dateInfo.substring(0, dateInfo.indexOf(" "));
                if (day === 'Sun' || day === 'Mon' || day === 'Fri')
                    return day + "day";
                else if (day === 'Tue')
                    return "Tuesday";
                else if (day === 'Wed')
                    return "Wednesday";
                else if (day === 'Thurs')
                    return "Thursday";
                else if (day === 'Sat')
                    return "Saturday";
                else
                    return "error"
            }

            // Adds updated weather contents to today's container
            $('#daily-container').empty().append(dailyWeather());

            function dailyWeather() {
                return (
                    '<h4 class="card-title" id="day"><img class="icon mr-3 my-0" id="daily-icon" src="img/loading-icon.gif" alt="Daily Weather Icon">' + dayOfWeek() + '</h4>' +
                    '<p class="weather-element mx-auto my-0" id="high-temperature">' + parseInt(weather.daily.data[0].temperatureHigh) + '° <i class="fas fa-thermometer-three-quarters"></i>' +
                    '</p><p class="weather-element mx-auto my-0" id="low-temperature">' + parseInt(weather.daily.data[0].temperatureLow) + '° <i class="fas fa-thermometer-quarter"></i>' +
                    '</p><p class="weather-element mx-auto my-0" id="precipitation">' + parseInt(weather.daily.data[0].precipProbability * 100) + '% <i class="fas fa-cloud-rain"></i>' +
                    '</p><p class="weather-element mx-auto my-0" id="day-summary">' + weather.daily.data[0].summary +
                    '</p><!--End Fetched Data from Dark Sky-->'
                )
            }

            // Adds updated weather contents to current container
            $('#current-container').empty().append(currentWeather());

            function currentWeather() {
                return (
                    '<h4 class="card-title" id="current"><img class="icon mr-3 my-0" id="current-icon" src="img/loading-icon.gif" alt="Current Weather Icon">Currently</h4>' +
                    '<br><p class="weather-element mx-auto my-0" id="current-temperature">' + parseInt(weather.currently.apparentTemperature) + '° <i class="fas fa-thermometer-half"></i>' +
                    '</p><p class="weather-element mx-auto my-0" id="current-precipProbability">' + parseInt(weather.currently.precipProbability * 100) + '% <i class="fas fa-cloud-rain"></i>' +
                    '</p><p class="weather-element mx-auto my-0" id="current-summary">' + weather.currently.summary +
                    '</p><!--End Fetched Data from Dark Sky-->'
                )
            }

            // Adds updated weather contents to 8 hours later container
            $('#later-container').empty().append(futureWeather());

            function futureWeather() {
                return (
                    '<h4 class="card-title" id="later"><img class="icon mr-3 my-0" id="later-icon" src="img/loading-icon.gif" alt="Later Weather Icon">8 Hours</h4>' +
                    '<br><p class="weather-element mx-auto my-0" id="current-temperature">' + parseInt(weather.hourly.data[8].apparentTemperature) + '° <i class="fas fa-thermometer-half"></i>' +
                    '</p><p class="weather-element mx-auto my-0" id="current-precipProbability">' + parseInt(weather.hourly.data[8].precipProbability * 100) + '% <i class="fas fa-cloud-rain"></i>' +
                    '</p><p class="weather-element mx-auto my-0" id="current-summary">' + weather.hourly.data[8].summary +
                    '</p><!--End Fetched Data from Dark Sky-->'
                )
            }

            // Library of icons
            let iconDisplay =
                [
                    {
                        'conditions': 'clear-day',
                        'url': 'img/clear-day.png'
                    }, {
                    'conditions': 'clear-night',
                    'url': 'img/clear-night.png'
                }, {
                    'conditions': 'rain',
                    'url': 'img/rain.png'
                }, {
                    'conditions': 'snow',
                    'url': 'img/snow.png'
                }, {
                    'conditions': 'sleet',
                    'url': 'img/sleet.png'
                }, {
                    'conditions': 'wind',
                    'url': 'img/wind.png'
                }, {
                    'conditions': 'fog',
                    'url': 'img/fog.png'
                }, {
                    'conditions': 'cloudy',
                    'url': 'img/cloudy.png'
                }, {
                    'conditions': 'partly-cloudy-day',
                    'url': 'img/partly-cloudy-day.png'
                }, {
                    'conditions': 'partly-cloudy-night',
                    'url': 'img/partly-cloudy-night.png'
                }

                ];

            // Adds today's icon
            $('#daily-icon').attr('src', dailyIconUrl());

            function dailyIconUrl() {
                for (let i = 0; i < iconDisplay.length; i++) {
                    if (weather.daily.icon === iconDisplay[i].conditions)
                        return iconDisplay[i].url
                }
            }

            // Adds current weather icon
            $('#current-icon').attr('src', currentIconUrl());

            function currentIconUrl() {
                for (let i = 0; i < iconDisplay.length; i++) {
                    if (weather.currently.icon === iconDisplay[i].conditions)
                        return iconDisplay[i].url
                }
            }

            // Adds 8 hours later icon
            $('#later-icon').attr('src', laterIconUrl());

            function laterIconUrl() {
                for (let i = 0; i < iconDisplay.length; i++) {
                    if (weather.hourly.data[8].icon === iconDisplay[i].conditions)
                        return iconDisplay[i].url
                }
            }

            // Adds branding icon
            $('#umbrella-watch').attr('src', umbrellaForecast());

            function umbrellaForecast() {
                for (let i = 0; i <= 8; i++) {
                    if ((weather.hourly.data[i].precipProbability * 100) >= 30)
                        return 'img/umbrella.png';
                    else
                        return 'img/clear-day.png'
                }
            }

            // $('#umbrella-verdict').text(umbrellaText()).hide().slideDown('slow');

            // $('#umbrella-verdict').fadeOut('slow').fadeIn('slow', function () {
            //     $(this).text(umbrellaText())
            // });

            //Hourly String function in case I need it later
            // function umbrellaText() {
            //     for (let i = 0; i <= 8; i++) {
            //         if ((weather.hourly.data[i].precipProbability * 100) >= 30){
            //             $('#umbrella-verdict').css('color', '#4591D6');
            //             return 'Bring an umbrella'
            //         } else
            //             $('#umbrella-verdict').css('color', '#FDB50D');
            //             return 'Leave your umbrella at home'
            //     }
            // }

            // function umbrellaText() {
            //     for (let i = 0; i <= 8; i++) {
            //         if ((weather.hourly.data[i].precipProbability * 100) >= 30) {
            //             $('#umbrella-verdict').css('color', 'lightgray');
            //             return 'Bring an umbrella!'
            //         } else
            //         $('#umbrella-verdict').css('color', '#FDB50D');
            //         return 'Leave that umbrella at home'
            //     }
            // }
        })
    }

    // Generates map
    mapboxgl.accessToken = mapboxToken;
    let map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        zoom: 3,
        center: [-98.4936, 29.4241],
    });

    // Lat Long Search
    $('#custom-search-btn').click(function (e) {
        e.preventDefault();
        var longitude = long.value;
        var latitude = lat.value;
        // Sets specified latitude and longitude in navbar
        // $('#location').text('Latitude: ' + latitude + ', ' + 'Longitude: ' + longitude);

        //Get Address from Long Lat
        reverseGeocode({lng: longitude, lat: latitude}, mapboxToken).then(function (result) {
            geocode(result, mapboxToken).then(function (result2) {
                $('#location').text(result);
                map.setCenter(result2);
                map.setZoom(10);
                var marker = new mapboxgl.Marker({
                    draggable: true,
                    color: "#FDB50D"
                })
                    .setLngLat(result2)
                    .addTo(map);
            });
        });

        // Calls function with inputted lat and long
        getWeather(lat.value, long.value, 'us');

    });
    //Create Draggable Marker
    let marker = new mapboxgl.Marker({
        draggable: true,
        color: "#FDB50D"
    })
        .setLngLat([-98.4936, 29.4241])
        .addTo(map);


    // Instructions for marker on drag end
    marker.on('dragend', onDragEnd);//add it to the map

    // Getting lat and log
    function onDragEnd() {
        var lngLat = marker.getLngLat();
        var fixedLng = lngLat.lng.toFixed(4);
        var fixedLat = lngLat.lat.toFixed(4);
        // Sets specified latitude and longitude in navbar
        $('#location').text('Longitude: ' + fixedLat + ', Longitude: ' + fixedLng);
        // Calls function with marker location
        getWeather(fixedLat, fixedLng, 'us')
    }


})

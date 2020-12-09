$(function () {
  $("#request").submit(function () {
    // alert("IN EVENT");
    getWeather(document.getElementById("cityRequest").value);
    return false;
  });
});

function requestSearchButton() {
  getWeather(document.getElementById("cityRequest").value);
}

function getWeather(cityName) {
  let api = "1f1d28382101bfd2a7810a3b1093ed08";
  let apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    api +
    "&units=metric&lang=it";

  // console.log(apiUrl);
  // CHECK error
  $.ajax({
    url: apiUrl,
    data: "",
    success: function () {
      console.log("Request Completed - Update Information [" + cityName + "]");
    },
    statusCode: {
      400: function () {
        alert("Richiesta non valida");
      },
      404: function () {
        alert("Nome della città errato");
      },
    },
  });

  $.getJSON(apiUrl, weatherData);
}

async function weatherData(data) {
  // alert(data.name);
  document.getElementById("nameCity").innerHTML = await _.get(data, "name", "");

  document.getElementById("description").innerHTML = await _.get(
    data,
    "weather[0].description",
    ""
  );

  /* IMMAGINE */
  let idIcon = await _.get(data, "weather[0].icon", "");
  let imageUrl = "https://openweathermap.org/img/wn/" + idIcon + "@2x.png";

  let myImg = $(".myImg");
  myImg.attr("src", imageUrl);

  await setBackgroundImage(idIcon.substr(0, 2));

  document.getElementById("temperature").innerHTML =
    (await _.get(data, "main.temp", "--")) + "°";
  document.getElementById("wind").innerHTML =
    "Velocità del Vento: " + (await _.get(data, "wind.speed", "--")) + " m/s";
  // document.getElementById("wind").innerHTML = "Velocità del Vento: " + data.wind.speed + " m/s";
  document.getElementById("tempMaxMin").innerHTML =
    "Max: " +
    (await _.get(data, "main.temp_max", "--")) +
    "° / " +
    "Min: " +
    (await _.get(data, "main.temp_min", "--")) +
    "°";
  document.getElementById("humidity").innerHTML =
    "Umidità: " + (await _.get(data, "main.humidity", "--")) + "%";
  document.getElementById("pressure").innerHTML =
    "Pressione: " + (await _.get(data, "main.pressure", "--")) + " Pa";
}

async function setBackgroundImage(id) {
  if (id == "01") {
    // SUN
    document.getElementById(
      "weatherBG"
    ).style.backgroundImage = await "url('images/Sun50.jpg')";
  } else if (id == "02") {
    // FEW CLOUD
    document.getElementById(
      "weatherBG"
    ).style.backgroundImage = await "url('images/FewClouds50.jpg')";
  } else if (id == "03" || id == "04") {
    // CLOUD
    document.getElementById(
      "weatherBG"
    ).style.backgroundImage = await "url('images/Clouds50.jpg')";
  } else if (id == "09" || id == "10") {
    // RAIN
    document.getElementById(
      "weatherBG"
    ).style.backgroundImage = await "url('images/Rain50.jpg')";
  } else if (id == "11") {
    // THUNDERSTORM
    document.getElementById(
      "weatherBG"
    ).style.backgroundImage = await "url('images/Thunderstorm50.jpg')";
  } else if (id == "13") {
    // SNOW
    document.getElementById(
      "weatherBG"
    ).style.backgroundImage = await "url('images/Snow50.jpg')";
  } else if (id == "50") {
    // MIST
    document.getElementById(
      "weatherBG"
    ).style.backgroundImage = await "url('images/Mist50.jpg')";
  }
}

/* LOCALIZATION */

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  // document.getElementById("latLong").innerHTML = "LAT:" + lat + " / LON:" + lon;
  let testURL =
    "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" +
    lat +
    "&longitude=" +
    lon +
    "&localityLanguage=it";
  // console.log(testURL);
  $.getJSON(testURL, takeCity);
}

function takeCity(data) {
  // console.log(data.locality);
  getWeather(data.locality);
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      // x.innerHTML = "User denied the request for Geolocation.";
      alert("Accesso alla posizione NEGATO");
      break;
    case error.POSITION_UNAVAILABLE:
      // x.innerHTML = "Location information is unavailable.";
      alert("Informazioni sulla posizione NON disponibili");
      break;
    case error.TIMEOUT:
      // x.innerHTML = "The request to get user location timed out.";
      alert("Richiesta Fallita");
      break;
    case error.UNKNOWN_ERROR:
      // x.innerHTML = "An unknown error occurred.";
      alert("Errore Sconosciuto");
      break;
  }
}

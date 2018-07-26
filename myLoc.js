var ourCoords = {
  latitude:  47.624851,
  longitude: -122.52099
};

var map;

var watchId = null;

function showMap (coords) {
  var googleLatAndLong = new google.maps.LatLng(coords.latitude, coords.longitude);

  var mapOptions = {
    zoom: 10,
    center: googleLatAndLong,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var mapDiv = document.querySelector('#map');
  map = new google.maps.Map(mapDiv, mapOptions);

  var title = 'Your Location';
  var content = 'You are here: ' + coords.latitude + ', ' + coords.longitude;
  addMaker(map, googleLatAndLong, title, content);
};

function displayLocation (position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;

  var div = document.querySelector('#location');
  div.textContent = 'You are at Latitude: ' + latitude + ', Longitude: ' + longitude;
  div.textContent += ' (with ' + Math.floor(position.coords.accuracy) + ' meters accuracy)';

  var km = computeDistance(position.coords, ourCoords);
  var distance = document.querySelector('#distance');
  distance.textContent = 'You are ' + km + ' km from the WickedlySmart HQ';
  if (!map) {
    showMap(position.coords);
  }
};

function addMaker (map, latlong, title, content) {
  var markerOptions = {
  	position: latlong,
  	map: map,
  	title: title,
  	clickable: true
  };

  var marker = new google.maps.Marker(markerOptions);

  var infoWindowOptions = {
  	content: content,
  	position: latlong
  };

  var infoWindow = new google.maps.InfoWindow(infoWindowOptions);

  google.maps.event.addListener(marker, 'click', function () {
    infoWindow.open(map);
  });

};

function displayError (error) {
  var errorTypes = {
    0: 'Unknown error',
    1: 'Permission denied by user',
    2: 'Position is not available',
    3: 'Reques timed out'
  };
  var errorMessage = errorTypes[error.code];
  if (error.code === 0 || error.code === 2) {
  	errorMessage = errorMessage + ' ' + error.message;
  }
  var div = document.querySelector('#location');
  div.textContent = errorMessage;
};

function getMyLocation () {
  if (navigator.geolocation) {
	var watchButton = document.querySelector('#watch');
	watchButton.addEventListener('click', watchLocation);
	var clearWatchButton = document.querySelector('#clearWatch');
	clearWatchButton.addEventListener('click', clearWatch);
  } else {
	alert('no geolocation support');
  }
};

function degreesToRadians (degrees) {
	var radians = (degrees * Math.PI) / 180;

	return radians;
}

function computeDistance (startCoords, destCoords) {
  var startLatRads = degreesToRadians(startCoords.latitude);
  var startLongRads = degreesToRadians(startCoords.longitude);
  var destLatRads = degreesToRadians(destCoords.latitude);
  var destLongRads = degreesToRadians(destCoords.longitude);

  var RADIUS = 6371;

  var distance = Math.floor(Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) + Math.cos(startLatRads) * Math.cos(destLatRads) * Math.cos(startLongRads - destLongRads)) * RADIUS);

  return distance;
};

function watchLocation (evt) {
  evt.preventDefault();
  watchId = navigator.geolocation.watchPosition(displayLocation, displayError);
};

function clearWatch (evt) {
  evt.preventDefault();
  if (watchId) {
  	navigator.geolocation.clearWatch(watchId);
  	watchId = null;
  }
};

getMyLocation();